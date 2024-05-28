from django.db import models
from user.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from coinexlib import CoinexPerpetualApi
from core.settings import DEFAULT_PROXY_USERNAME, DEFAULT_PROXY_PASSWORD, DEFAULT_PROXY_URL, NONE_VIP_CREATION_LIMIT, NONE_VIP_GRIDS_CREATION_LIMIT
from .forms import CreateCoinexAccountForm
from django.core import signing

from django.core.cache import cache

class GridBot(models.Model):
    name = models.CharField(max_length=50)
    status = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    interval = models.IntegerField(default=60)
    lastTimeCheck=models.DateTimeField(blank=True, null=True , auto_now=False, auto_now_add=False)
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

    workerCachName="GridBotWorking"
    workerCachTime=350

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
            if account.closePosition(self.contract):
                self.Grids.all().update(is_active=False)
                self.status = False
                self.save()
                return self
        return False


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
        order = self.gridbot.account.createOrder(
            price, self.nextPosition, self.size, contract)
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
    
    def resume( self,nextPosition  ) :
        grid = Grid.objects.filter(id=self.id, status=3)
        if grid :
            grid.update(nextPosition =nextPosition ,status=0)
        return Grid.objects.get(id=self.id)
    
    def  delete( self  ) :
        grid = Grid.objects.filter(id=self.id, status=3)
        if grid :
            grid.update(is_active=False)



class Order(models.Model):
    exactCreationtResponse = models.TextField(unique=True)
    orderID = models.CharField(max_length=50)
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


class CoinexAccount(models.Model):

    name = models.CharField(max_length=50, unique=True)
    access_ID = models.CharField(max_length=200)
    secret_key = models.CharField(max_length=200)
    user = models.ForeignKey(User, related_name=(
        "CoinexAccounts"), on_delete=models.PROTECT)
    form = CreateCoinexAccountForm

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.access_ID :
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

    def createOrder(self, price, position, order_size, contract):
        market = contract.apiIdentifier
        robot = self.robot
        robot.ORDER_DIRECTION_SELL if position == 1 else robot.ORDER_DIRECTION_BUY
        try:
            result = robot.put_limit_order(
                market,
                position,
                order_size,
                price
            )
            print(result)
            if result["code"] == 0:
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
            return None

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


class Contract (models.Model):
    exchange = models.ForeignKey(
        Exchange, related_name="Contracts", on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    apiIdentifier = models.CharField(max_length=50)

    def __str__(self):
        return self.name
