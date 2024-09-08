from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from coinexlib import CoinexPerpetualApi
from coinexlibV2 import CoinexPerpetualApiV2

from lyralib import LyraApi
from core.settings import PROXY
from django.core import signing
from django.core.cache import cache
from user.models import User
import requests


def asstUSDRate(name):
    cachName = name + "asstUSDRate"
    cachedRate = cache.get(cachName)
    if cachedRate:
        return float(cachedRate)
    rate = 0
    api = CoinexPerpetualApi("", "", PROXY)
    if name == "BTC":

        response = api.get_market_state(market="BTCUSD")
        if response["code"] == 0:
            rate = float(response["data"]['ticker']["index_price"])
    elif name == "USD":
        rate = 1
    elif name == "USDC":
        rate = 1
    elif name == "ETH":
        response = api.get_market_state(market="ETHUSD")
        if response["code"] == 0:
            rate = float(response["data"]['ticker']["index_price"])
    elif name == "USDT":
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
                self.client = CoinexPerpetualApiV2(signing.loads(
                    self.access_ID), signing.loads(self.secret_key), PROXY)
                self.robot = CoinexPerpetualApi(signing.loads(
                    self.access_ID), signing.loads(self.secret_key), PROXY)
            else:
                self.client = CoinexPerpetualApiV2(
                    self.access_ID, self.secret_key, PROXY)                
                self.robot = CoinexPerpetualApi(
                    self.access_ID, self.secret_key, PROXY)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.access_ID = signing.dumps(self.access_ID)
            self.secret_key = signing.dumps(self.secret_key)
        super().save(*args, **kwargs)

    def USDValue(self):
        response = " "
        try:
            totalUSD = 0
            response = self.client.query_account()
            print(response)
            if response["code"] == 0:
                for asset in response["data"]:
                    from strategy.models import Asset
                    strSymbol =asset['ccy']
                    asset = Asset.objects.filter(strSymbol=strSymbol)
                    if not asset:
                        continue
                    asset = asset[0]
                    totalAsset = float(asset['available']) + float(
                       asset['margin']) + float( asset['unrealized_pnl']) + float( asset['frozen'])
                    totalUSD += (totalAsset * asset.USDRate())
            else:
                print(" get_assets Coinex  unknown CODE")
                return None
            return round(totalUSD, 2)
        except Exception as e:
            print(str(e) + " get_assets Coinex ")
            return None


class LyraAccount(models.Model):
    sessionPrivateKey = models.CharField(max_length=255)
    sessionPublicKey = models.CharField(max_length=255)
    smart_Contract_Wallet_Address = models.CharField(max_length=255)
    subAccountID = models.IntegerField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.smart_Contract_Wallet_Address:
            if self.id:
                self.client = LyraApi(signing.loads(
                    self.smart_Contract_Wallet_Address), self.sessionPublicKey, signing.loads(self.sessionPrivateKey), PROXY)
            else:
                self.client = LyraApi(
                    self.smart_Contract_Wallet_Address, self.sessionPublicKey, self.sessionPrivateKey, PROXY)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.sessionPrivateKey = signing.dumps(self.sessionPrivateKey)
            self.smart_Contract_Wallet_Address = signing.dumps(
                self.smart_Contract_Wallet_Address)
        super().save(*args, **kwargs)

    def USDValue(self):
        response = " "
        try:
            totalUSD = 0
            accountID = self.subAccountID
            response = self.client.subAccount(accountID)
            print(response)
            if response["result"]['subaccount_id'] == accountID:
                for collateral in response["result"]["collaterals"]:
                    from strategy.models import Asset
                    asset = Asset.objects.filter(
                        strSymbol=collateral['asset_name'])
                    if not asset:
                        continue
                    asset = asset[0]
                    totalAsset = float(collateral['amount'])
                    totalUSD += (totalAsset * asset.USDRate())
                totalUSD += float(response["result"]["positions_value"])
            else:
                print(" USDValue Lyra  no Result")
                return None
            return round(totalUSD, 2)
        except Exception as e:
            print(str(e) + " USDValue Lyra ")
            return None


class Account(models.Model):
    account_model = models.ForeignKey(
        ContentType, on_delete=models.PROTECT, related_name="Accounts")
    account_id = models.IntegerField()
    account = GenericForeignKey('account_model', 'account_id')

    def USDValue(self):
        return self.account.USDValue()


class History(models.Model):
    btcROI = models.IntegerField()
    usdROI = models.IntegerField()
    ethROI = models.IntegerField()
    date = models.DateField(auto_now=False, auto_now_add=False)
    strategy = models.ForeignKey(
        "strategy.Strategy", related_name="Histories", on_delete=models.PROTECT)

    def __str__(self):
        return str(self.usdROI)+" " + str(self.date)


def getHistoryDate(history: History):
    return {
        "id": history.id,
        "btcROI": history.btcROI,
        "ethROI": history.ethROI,
        "usdROI": history.usdROI,
        "date":  history.date
    }


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


class Participant(models.Model):
    strategy = models.ForeignKey(Strategy,  on_delete=models.PROTECT)
    user = models.ForeignKey(
        User, related_name="Participants", on_delete=models.PROTECT)
    share = models.FloatField()
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.share) + str(self.user.email) if self.user else ""


class ParticipantBTCAddress(models.Model):
    address = models.CharField(unique=True, blank=True, max_length=100)
    user = models.OneToOneField(User, null=True, blank=True, related_name=(
        "ParticipantBTCAddress"), on_delete=models.PROTECT)

    def __str__(self):
        return (self.user.email if self.user else "") + self.address

    def createParticipantBTCAddress(user: User):
        unUsedparticipantBTCAddress = ParticipantBTCAddress.objects.filter(
            user__isnull=True)
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
                f"https://mempool.space/api/address/{btcAddress}/txs/chain").json()
            txsResponse = [
                {"result": sum([(out["value"] if out["scriptpubkey_address"] == btcAddress else 0)for out in tx["vout"]]), "hash": tx["txid"]} for tx in response
            ]
            cache.set(btcAddress, txsResponse, timeout=600)
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
    created = models.DateField(auto_now_add=True)
    assetValue = models.ManyToManyField(
        AssetValue, related_name="Transactions")
    address = models.ForeignKey(
        ParticipantBTCAddress, related_name="Transactions", on_delete=models.PROTECT)
    participants = models.ManyToManyField(
        Participant, related_name="Transactions")

    def __str__(self):
        return str(self.txHash)[-5:-1]


class Withdraw (models.Model):
    BTCAddress = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, related_name="Withdraws", on_delete=models.PROTECT)
    status = models.BooleanField(null=True, blank=True)
    fee = models.ForeignKey(AssetValue, blank=True,
                            null=True, on_delete=models.PROTECT)
    amount = models.ForeignKey(
        AssetValue, blank=True, null=True, related_name="Withdraws", on_delete=models.PROTECT)



