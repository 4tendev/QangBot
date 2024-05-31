from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from coinexlib import CoinexPerpetualApi
from core.settings import DEFAULT_PROXY_USERNAME, DEFAULT_PROXY_PASSWORD, DEFAULT_PROXY_URL
from django.core import signing
from django.core.cache import cache
from user.models import User
import requests
from django.core.cache import cache


def getHistoryDate(history):
    return {
        "id": history.id,
        "btcROI": history.btcROI,
        "ethROI": history.ethROI,
        "usdROI": history.usdROI,
        "date":  history.date
    }


def asstUSDRate(name):
    cachName = name + "asstUSDRate"
    cachedRate = cache.get(cachName)
    if cachedRate:
        return float(cachedRate)
    rate = 0
    api = CoinexPerpetualApi("", "", {
        'https': f'http://{DEFAULT_PROXY_USERNAME}:{ DEFAULT_PROXY_PASSWORD}@{DEFAULT_PROXY_URL}'
    })
    match name:
        case "BTC":
            response = api.get_market_state(market="BTCUSD")
            if response["code"] == 0:
                rate = float(response["data"]['ticker']["index_price"])
        case "USD":
            rate = 1
        case "USDC":
            rate = 1
        case "ETH":
            response = api.get_market_state(market="ETHUSD")
            if response["code"] == 0:
                rate = float(response["data"]['ticker']["index_price"])
        case "USDT":
            rate = 1
    cache.set(cachName, rate, timeout=120)
    return rate


class Asset(models.Model):
    name = models.CharField(max_length=50)
    strSymbol = models.CharField(max_length=10)

    def USDRate(self):
        name = self.name
        return asstUSDRate(name)

    def __str__(self):
        return self.name


class AssetValue(models.Model):
    asset = models.ForeignKey(Asset, related_name=(
        "Values"), on_delete=models.PROTECT)
    amount = models.FloatField()

    def currentUSDValue(self):
        return round(self.amount * self.asset.USDRate(), 2)

    def __str__(self):
        return str(self.amount) + str(self.asset.name)


class CoinexFutureAccount(models.Model):

    access_ID = models.CharField(max_length=200)
    secret_key = models.CharField(max_length=200)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.access_ID:
            if self.id:
                self.robot = CoinexPerpetualApi(signing.loads(self.access_ID), signing.loads(self.secret_key), {
                    'https': f'http://{DEFAULT_PROXY_USERNAME}:{ DEFAULT_PROXY_PASSWORD}@{DEFAULT_PROXY_URL}'
                })
            else:
                self.robot = CoinexPerpetualApi(self.access_ID, self.secret_key, {
                    'https': f'http://{DEFAULT_PROXY_USERNAME}:{ DEFAULT_PROXY_PASSWORD}@{DEFAULT_PROXY_URL}'
                })

    def save(self, *args, **kwargs):
        if not self.pk:
            self.access_ID = signing.dumps(self.access_ID)
            self.secret_key = signing.dumps(self.secret_key)
        super().save(*args, **kwargs)

    def USDValue(self):
        response = " "
        try:
            totalUSD = 0
            response = self.robot.query_account()
            if response["code"] == 0:
                for accountAsset in response["data"]:
                    from strategy.models import Asset
                    asset = Asset.objects.filter(strSymbol=accountAsset)
                    if not asset:
                        continue
                    asset = asset[0]
                    totalAsset = float(response["data"][accountAsset]['balance_total']) + float(
                        response["data"][accountAsset]['margin']) + float(response["data"][accountAsset]['profit_unreal'])
                    totalUSD += (totalAsset * asset.USDRate())
            else:
                print(response)
                print(" get_assets Coinex  unknown CODE")
                return None
            return round(totalUSD, 2)
        except Exception as e:
            print(response)
            print(str(e) + " get_assets Coinex ")
            return None


class Account(models.Model):
    account_model = models.ForeignKey(
        ContentType, on_delete=models.PROTECT, related_name="Accounts")
    account_id = models.IntegerField()
    account = GenericForeignKey('account_model', 'account_id')

    def USDValue(self):
        return self.account.USDValue()


class Strategy(models.Model):
    name = models.CharField(max_length=50)
    baseAssetValues = models.ManyToManyField(
        AssetValue, related_name="Strategies", blank=True)
    accounts = models.ManyToManyField(Account, blank=True)
    currentAssetValues = models.ManyToManyField(AssetValue, blank=True)
    lastUSDCheck = models.IntegerField()

    def __str__(self):
        return self.name

    def currentUSDValue(self):
        USDValue = 0
        accounts = self.accounts.all()
        if accounts:
            for account in accounts:
                accountUSDValue = account.USDValue()
                USDValue += accountUSDValue
        currentAssets = self.currentAssetValues.all()
        if currentAssets:
            for currentAsset in currentAssets:
                USDValue += currentAsset.currentUSDValue()
        return USDValue

    def cachHistoryName(self):
        return str(self.id) + str(self.name).replace(" ", "")

    def cachHistory(self):
        try:
            histrories = self.Histories.all().order_by("date")
            data = [getHistoryDate(history) for history in histrories
                    ]if histrories else []
            cachName = self.cachHistoryName()
            cache.set(cachName, data, timeout=None)
        except Exception as e:
            print(e)
            print("CACHING Failed")

    def chachedHistory(self):
        try:
            cachName = self.cachHistoryName()
            data = cache.get(cachName)
            return data
        except Exception as e:
            print(e)
            print("get Caching Failed")
            return None


class History(models.Model):
    btcROI = models.IntegerField()
    usdROI = models.IntegerField()
    ethROI = models.IntegerField()
    date = models.DateField(auto_now=False, auto_now_add=False)
    strategy = models.ForeignKey(
        Strategy, related_name="Histories", on_delete=models.PROTECT)

    def __str__(self):
        return str(self.usdROI)+" " + str(self.date)


class Participant(models.Model):
    strategy = models.ForeignKey(Strategy,  on_delete=models.PROTECT)
    user = models.ForeignKey(
        User, related_name="Participants", on_delete=models.PROTECT)
    share = models.FloatField()
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.share) + str(self.user.email)


class ParticipantBTCAddress(models.Model):
    address = models.CharField(unique=True, blank=True, max_length=100)
    user = models.ForeignKey(User, related_name=(
        "ParticipantBTCAddresses"), null=True, on_delete=models.PROTECT)

    def createParticipantBTCAddress(user: User):
        unUsedparticipantBTCAddress = ParticipantBTCAddress.objects.filter(
            address__isnull=True)
        if not unUsedparticipantBTCAddress:
            print("Please add reciving btc address so users can deposit")
            return None
        unUsedparticipantBTCAddress = unUsedparticipantBTCAddress[0]
        unUsedparticipantBTCAddress.user = user
        unUsedparticipantBTCAddress.save()
        return unUsedparticipantBTCAddress

    def depositAddress(user):
        participantBTCAddress = ParticipantBTCAddress.objects.filter(user=user)
        if participantBTCAddress:
            return participantBTCAddress[0]
        else:
            return ParticipantBTCAddress.createParticipantBTCAddress(user=user)

    def checkTransaction(self):
        btcAddress = self.address
        txsResponse = cache.get(btcAddress)
        if not txsResponse:
            response = requests.get(
                f"https://blockchain.info/rawaddr/{btcAddress}")
            if response.status_code == 200:
                txsResponse = response.json()["txs"]
                cache.set(btcAddress, txsResponse, timeout=300)
        if txsResponse:
            for tx in txsResponse:
                if tx["result"] > 0:
                    transaction = Transaction.objects.get_or_create(
                        txHash=tx["hash"], address=self)
                    if transaction[1]:
                        assetValue = AssetValue.objects.create(amount=(
                            tx["result"]/100000000), asset=Asset.objects.get_or_create(strSymbol="BTC", name="BTC")[0])
                        transaction[0].assetValue.add(assetValue)


class Transaction(models.Model):
    txHash = models.CharField(unique=True, max_length=255)
    assetValue = models.ManyToManyField(
        AssetValue, related_name="Transactions")
    address = models.ForeignKey(
        ParticipantBTCAddress, related_name="Transactions", on_delete=models.PROTECT)
    participants = models.ManyToManyField(
        Participant, related_name="Transactions")
