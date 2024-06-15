from django.db import models
from user.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from coinexlib import CoinexPerpetualApi
from coinexlibV2 import CoinexPerpetualApiV2
from aevolib import AevoApi

from core.settings import PROXY, NONE_VIP_CREATION_LIMIT, NONE_VIP_GRIDS_CREATION_LIMIT
from .forms import CreateCoinexAccountForm, CreateAveoAccountForm
from django.core import signing

from django.core.cache import cache


class GridBot(models.Model):
    name = models.CharField(max_length=50)
    status = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    interval = models.IntegerField(default=60)
    lastTimeCheck = models.DateTimeField(
        blank=True, null=True, auto_now=False, auto_now_add=False)
    position = models.FloatField(default=0)
    account_model = models.ForeignKey(
        ContentType, on_delete=models.PROTECT, related_name="GridBots")
    account_id = models.IntegerField()
    account = GenericForeignKey('account_model', 'account_id')
    contract = models.ForeignKey(
        "gridbot.Contract", related_name="GridBots", on_delete=models.PROTECT)
    user = models.ForeignKey(User, related_name=(
        "GridBots"), on_delete=models.PROTECT)
    noneVIPCreationLimit = int(NONE_VIP_CREATION_LIMIT)
    noneVIPGridsCreationLimit = int(NONE_VIP_GRIDS_CREATION_LIMIT)

    workerCachName = "GridBotWorking"
    workerCachTime = 350

    def cachWorkerWorking():
        cache.set(GridBot.workerCachName, 1, timeout=GridBot.workerCachTime)

    def checkWorkerWorking():
        return cache.get(GridBot.workerCachName)

    def removeAllGrids(self) -> bool:
        if self.account.cancelAllOrders(self.contract):
            self.Grids.all().update(is_active=False)
            return True
        return False

    def gridCreationLimit(self):
        return None if self.account.user.isVIP() else (GridBot.noneVIPGridsCreationLimit - Grid.objects.filter(gridbot=self).count())

    def canCreate(user: User):
        return (user.isVIP() or GridBot.objects.filter(user=user).count() < GridBot.noneVIPCreationLimit)

    def canCreateNewGrids(self, newGridsCount: int) -> bool:
        return True if self.gridCreationLimit() == None else self.gridCreationLimit() >= newGridsCount

    def __str__(self):
        return self.name

    def makeOrders(self) -> int:
        grids = self.Grids.all()
        if grids:
            for grid in grids:
                grid.createOrder()

    def checkOpenGrids(self):
        if not self.Grids.filter(status=1):
            return
        pendingOrdersIDs = self.account.getPendingOrdersID(self)
        if pendingOrdersIDs != None:
            needToCheckGrids = self.Grids.all().exclude(
                order__orderID__in=pendingOrdersIDs)
            if needToCheckGrids:
                for grid in needToCheckGrids:
                    grid.checkOrder()

    def stop(self):
        account = self.account
        if account.cancelAllOrders(self.contract):
            self.Grids.all().update(is_active=False)
            if account.closePosition(self.contract):
                self.position = 0
                self.status = False
                self.save()
                return self
        return False

    def updatePositionValue(self):
        account = self.account
        position = account.getPositionValue(self.contract)
        if not position == None:
            GridBot.objects.filter(id=self.id).update(position=position)


class ActiveProxyManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class Grid(models.Model):
    positions = [
        (1, 'sell'),
        (2, 'buy'),
    ]
    stats = [
        (0, "start"),
        (1, 'open'),
        (2, 'filled'),
        (3, "pause")
    ]
    sell = models.FloatField()
    buy = models.FloatField()
    size = models.FloatField()
    nextPosition = models.IntegerField(choices=positions)
    status = models.IntegerField(choices=stats)
    gridbot = models.ForeignKey(GridBot, related_name=(
        "Grids"), on_delete=models.PROTECT)
    order = models.OneToOneField("gridbot.Order", related_name="grid",
                                 on_delete=models.PROTECT, null=True, blank=True)
    orders = models.ManyToManyField(
        "gridbot.Order", related_name="Grids", blank=True)
    is_active = models.BooleanField(default=True)
    objects = ActiveProxyManager()

    def createOrder(self):
        grid = Grid.objects.filter(id=self.id, status__in=[0, 2])
        if not grid:
            return
        contract = self.gridbot.contract
        price = self.sell if self.nextPosition == 1 else self.buy
        size = self.size
        order = self.gridbot.account.createOrder(
            price, self.nextPosition, size, contract)
        if order:
            self.orders.add(order)
            excutedPosition = self.nextPosition
            Grid.objects.filter(id=self.id).update(
                order=order, status=1, nextPosition=1 if excutedPosition == 2 else 2)
        elif order == False:
            Grid.objects.filter(id=self.id).update(status=3)

    def checkOrder(self):
        if self.status == 1:
            isFinished = self.order.isFinished()
            if isFinished == True:
                Grid.objects.filter(id=self.id).update(status=2)
            elif isFinished == False:
                Grid.objects.filter(id=self.id).update(status=3)

    def pause(self):
        grid = Grid.objects.filter(id=self.id, status__in=[0, 2, 1])
        if grid:
            if not self.order or self.order.cancelOrder():
                grid.update(status=3)
        return Grid.objects.get(id=self.id)

    def resume(self, nextPosition):
        grid = Grid.objects.filter(id=self.id, status=3)
        if grid:
            grid.update(nextPosition=nextPosition, status=0)
        return Grid.objects.get(id=self.id)

    def delete(self):
        grid = Grid.objects.filter(id=self.id, status=3)
        if grid:
            grid.update(is_active=False)


class Order(models.Model):
    exactCreationtResponse = models.TextField()
    orderID = models.CharField(max_length=255, unique=True)
    executed = models.BooleanField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    contract = models.ForeignKey("gridbot.Contract", related_name=(
        "Orders"), on_delete=models.PROTECT)

    def __str__(self):
        return self.contract.name

    def isFinished(self):
        account = self.grid.gridbot.account
        isFinished = account.isOrderFinished(
            self.orderID, self.contract)
        self.executed = isFinished
        self.save()
        return isFinished

    def cancelOrder(self):
        contract = self.contract
        isOrderCanceled = self.grid.gridbot.account.cancelOrder(
            self.orderID, contract)
        if isOrderCanceled:
            self.executed = False
            self.save()
        return isOrderCanceled


class Exchange(models.Model):
    name = models.CharField(max_length=50)
    account_model = models.OneToOneField(
        ContentType, on_delete=models.PROTECT)
    secretRequiredTag = "secretRequired"

    def getAccountSecretFiledsName(self):

        return self.account_model.model_class().getSecretFieldsName()

    def __str__(self):
        return self.name


class Contract (models.Model):
    exchange = models.ForeignKey(
        Exchange, related_name="Contracts", on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    apiIdentifier = models.CharField(max_length=50)
    sizeDeciminal = models.IntegerField(default=2)
    priceDeciminal = models.IntegerField(default=2)

    def __str__(self):
        return self.name


class CoinexAccount(models.Model):
    account_id = models.CharField(max_length=200, null=True, blank=True)
    name = models.CharField(max_length=50, unique=True)
    access_ID = models.CharField(max_length=200)
    secret_key = models.CharField(max_length=200)
    user = models.ForeignKey(User, related_name=(
        "CoinexAccounts"), on_delete=models.PROTECT)
    form = CreateCoinexAccountForm

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

    def cancelOrder(self, orderID, contract):
        market = contract.apiIdentifier
        try:
            response = self.robot.cancel_order(market=market, order_id=orderID)
            print(response)
            if response["code"] == 0:
                return True
            elif response["code"] == 3103:
                return True
            else:
                print(" check data response status do acordingly cancelOrder ")
                return None
        except Exception as e:
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to  checkOrder connection")
            return None

    def isOrderFinished(self, orderID, contract):

        market = contract.apiIdentifier
        try:
            response = self.robot.query_order_status(
                market=market, order_id=orderID)
            print(response)

            if response["code"] == 0:
                if response["data"]["status"] == "done":
                    return True
                elif response["data"]["status"] == "cancel":
                    print(str(orderID) + " FALSE cancel")
                    return False
                else:
                    print(" heck data response status do acordingly isFinished ")
                    return None
            elif response["code"] == 3103:
                print(str(orderID) + " FALSE 3103")
                return False
            else:
                print("check response CODE PLZ nad do acordingly")
                return None
        except Exception as e:
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to checkOrder")
            return None

    def getPendingOrdersID(self, bot):
        result = "getPendingOrdersID"
        try:
            market = bot.contract.apiIdentifier
            openOrdersKeys = []
            limit = 100
            offset = 0
            totalGrids = bot.Grids.filter(status=1).count()
            for i in range(0, (int(totalGrids/100) + 1)):
                result = self.robot.query_order_pending(
                    market=market, side=0, offset=offset, limit=limit)
                if result["code"] == 0:
                    orderes = result["data"]["records"]
                    if orderes:
                        for order in orderes:
                            openOrdersKeys.append(order["order_id"])
                    offset += 100
                elif result["code"] == 3007:
                    return None
                else:
                    print(result)
                    print(" UNKNOWN CODE ACT ACORDINGLY ")
                    return None
            return openOrdersKeys
        except Exception as e:
            print(result)
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to getPendingOrdersID")
            return None

    def cancelAllOrders(self, contract):
        result = " "
        try:
            market = contract.apiIdentifier
            result = self.robot.cancel_all_order(market=market)
            if result["code"] == 0:
                return True
            else:
                print(result)
                print(" UNKNOWN CODE ACT ACORDINGLY ")
                print(
                    str(e) + f" CoinexAccount with id {self.id}  cancelAllOrders")
        except Exception as e:
            print(result)
            print(str(
                e) + f" CoinexAccount with id {self.id} Failed to in connetion cancelAllOrders")
        return False

    def getPositionValue(self, contract):
        result = " "
        try:
            market = contract.apiIdentifier
            positions = self.robot.query_position_pending(market=market)
            if not positions["code"] == 0:
                return None
            if positions["data"]:
                for position in positions["data"]:
                    if position["market"] == market:
                        return (1 if position["side"] == 2 else -1) * float(position["amount"])
            return 0
        except Exception as e:
            print(result)
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to in connetion getPositionValue")
        return None

    def closePosition(self, contract):
        result = " "
        try:
            market = contract.apiIdentifier
            positions = self.robot.query_position_pending(market=market)[
                "data"]
            if positions:
                for position in positions:
                    result = self.robot.close_market(
                        market=market, position_id=position['position_id'])
                    if result["code"] != 0:
                        print(result)
                        print(" UNKNOWN CODE ACT ACORDINGLY ")
                        return False
                return True
            else:
                return True
        except Exception as e:
            print(result)
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to in connetion closePosition")
        return False

    def createOrder(self, price, position, order_size, contract: Contract):
        market = contract.apiIdentifier
        robot = self.robot
        robot.ORDER_DIRECTION_SELL if position == 1 else robot.ORDER_DIRECTION_BUY
        try:
            response = None
            result = robot.put_limit_order(
                market,
                position,
                order_size,
                price
            )
            print(result)
            if result["code"] == 0:
                response = False
                order = Order.objects.create(
                    exactCreationtResponse=result, contract=contract, orderID=result["data"]["order_id"])
                return order
            elif result["code"] == 3109:
                print(f"balance not enough {self.id } createOrder  ")
                return False
            elif result["code"] == 3127:
                print(f"Small   {self.id } createOrder  ")
                return False
            else:
                print(
                    f" CoinexAccount with id {self.id} UNKNOW CODE ACT ACORDINGLY")
                return None
        except Exception as e:
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to in connetion createOrder")
        return response

    def checkAccount(self):
        try:
            response = self.robot.query_account()
            print(response)
            if response["code"] in [0, 3007]:
                return True
            return False
        except Exception as e:
            print(str(e) + " checkAccount Coinex ")
            return False

    def getSecretFieldsName():
        return ["access_ID", "secret_key"]


class AevoAccount(models.Model):
    name = models.CharField(max_length=50, unique=True)
    account_id = models.CharField(max_length=200, null=True, blank=True)
    API_Key = models.CharField(max_length=200)
    API_Secret = models.CharField(max_length=200)
    Signing_Key = models.CharField(max_length=200)
    user = models.ForeignKey(User, related_name=(
        "AevoAccounts"), on_delete=models.PROTECT)
    form = CreateAveoAccountForm

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.API_Key:
            if self.id:
                self.client = AevoApi(signing.loads(
                    self.API_Key), signing.loads(self.API_Secret), signing.loads(self.Signing_Key), PROXY)
            else:
                self.client = AevoApi(
                    self.API_Key, self.API_Secret, self.Signing_Key, PROXY)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.API_Key = signing.dumps(self.API_Key)
            self.API_Secret = signing.dumps(self.API_Secret)
            self.Signing_Key = signing.dumps(self.Signing_Key)

        super().save(*args, **kwargs)

    def getSecretFieldsName():
        return ["API_Key", "API_Secret", "Signing_Key"]

    def checkAccount(self):
        try:
            response = self.client.account()
            if response["account"]:
                if not self.account_id:
                    return response["account"]
                else:
                    return response["account"] if response["account"] == self.account_id else False
            return False
        except Exception as e:
            print(str(e) + " checkAccount AevoAccount ")
            return False

    def getPendingOrdersID(self, bot: GridBot):
        result = "getPendingOrdersID"
        try:
            instrument = str(bot.contract.apiIdentifier)
            openOrdersKeys = []
            totalGrids = bot.Grids.filter(status=1).count()
            if totalGrids > 0:
                orderes = self.client.allOpenOrders()
                print(orderes)
                if len(orderes) > 0:
                    for order in orderes:
                        if instrument == order["instrument_id"] and order['order_status'] == 'opened':
                            openOrdersKeys.append(order["order_id"])
            return openOrdersKeys
        except Exception as e:
            print(result)
            print(
                str(e) + f" AevoAccount with id {self.id} Failed to getPendingOrdersID")
            return None

    def cancelOrder(self, orderID, contract: Contract):
        try:
            response = self.client.cancelOrder(order_id=orderID)
            print(response)
            if response["order_id"] == orderID and response["order_status"] == 'cancelled':
                return True
            else:
                print(
                    "AevoAccount check data response status do acordingly cancelOrder  ")
                return None
        except Exception as e:
            if response["error"] == "ORDER_DOES_NOT_EXIST":
                return True
            print(
                f"An unexpected error occurred: {e} AevoAccount with id {self.id} Failed to cancelOrder connection"
            )
            return None

    def isOrderFinished(self, orderID, contract: Contract):

        try:
            order = self.client.order(orderID)
            print(order)

            if order["order_status"] == "filled":
                return True
            elif order["order_status"] == "cancelled":
                print(str(orderID) + " FALSE cancel")
                return False
            elif order["order_status"] in ["opened", "partial"]:
                return None
            else:
                print(
                    "AevoAccount heck data response status do acordingly isOrderFinished ")
                return None
        except Exception as e:
            print(
                str(e) + f" AevoAccount with id {self.id} Failed to isOrderFinished")
            return None

    def cancelAllOrders(self, contract):
        result = " "
        try:
            instrument_name = contract.name

            market = self.client.market(instrument_name)
            asset = market["asset"]
            instrument_type = market["instrument_type"]
            result = self.client.cancelOrders(instrument_type, asset)
            if result["success"] == True:
                return True
            else:
                print(result)
                print(" UNKNOWN CODE ACT ACORDINGLY ")
                print(
                    str(e) + f" AevoAccount with id {self.id}  cancelAllOrders")
        except Exception as e:
            if result["error"] == "NO_ORDERS_TO_CANCEL":
                return True
            print(result)
            print(str(
                e) + f" AevoAccount with id {self.id} Failed to in connetion cancelAllOrders")
        return False

    def getPositionValue(self, contract: Contract):
        result = " "
        try:
            instrument_id = contract.apiIdentifier
            positions = self.client.positions()["positions"]
            if len(positions) > 0:
                for position in positions:
                    if position["instrument_id"] == str(instrument_id):
                        return (1 if position["side"] == 'buy' else -1) * float(position["amount"])
            return 0
        except Exception as e:
            print(result)
            print(
                str(e) + f" AevoAccount with id {self.id} Failed to in connetion getPositionValue")
        return None

    def createOrder(self, price, position, order_size, contract: Contract):
        response = None
        instrument = contract.apiIdentifier
        client = self.client
        is_buy = False if position == 1 else True
        try:
            result = client.createOrder(
                instrument,
                is_buy,
                round(order_size, contract.sizeDeciminal),
                round(price, contract.priceDeciminal),
                self.account_id
            )
            print(result)
            if result["order_id"]:
                response = False
                order = Order.objects.create(
                    exactCreationtResponse=result, contract=contract, orderID=result["order_id"])
                return order
            else:
                print(
                    f" AevoAccount with id {self.id} UNKNOW response ACT ACORDINGLY")
                return None
        except Exception as e:
            print(
                str(e) + f" AevoAccount with id {self.id} Failed to in connetion createOrder")
        return response

    def closePosition(self, contract: Contract):
        result = " "
        try:
            instrument = contract.apiIdentifier
            positionAmount = self.getPositionValue(contract)
            if positionAmount != 0:
                is_buy = False if positionAmount > 0 else True
                amount = abs(positionAmount)
                client = self.client
                price = round(float(client.market(contract.name)[
                              "mark_price"]) * (1.05 if is_buy else 0.95), contract.priceDeciminal)
                result = client.createOrder(
                    instrument,
                    is_buy,
                    amount,
                    price,
                    self.account_id
                )
                print(result)
                if float(result['filled']) == amount:
                    return True
                else:
                    client.cancelOrder(result["order_id"])
            else:
                return True
        except Exception as e:
            print(result)
            print(
                str(e) + f" CoinexAccount with id {self.id} Failed to in connetion closePosition")
        return False
