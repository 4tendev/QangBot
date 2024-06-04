from django.core.management.base import BaseCommand
import time
from gridbot.models import GridBot, Exchange, ContentType, CoinexAccount, Contract
from django.core.cache import cache
import datetime


def create_default_exchange():
    coinexFutureExchange = Exchange.objects.get_or_create(
        name="Coinex Future", account_model=ContentType.objects.get_for_model(CoinexAccount))
    CoinexFutureContracts = [
        {
            "name": "BTCUSDT",
            "url": "https://www.coinex.com/en/futures/marketinfo/info?market=BTCUSDT",
            "apiIdentifier": "BTCUSDT"
        },
        {
            "name": "BTCUSD",
            "url": "https://www.coinex.com/en/futures/marketinfo/info?market=BTCUSD",
            "apiIdentifier": "BTCUSD"
        },
        {
            "name": "ETHUSD",
            "url": "https://www.coinex.com/en/futures/marketinfo/info?market=ETHUSD",
            "apiIdentifier": "ETHUSD"
        }

    ]
    for contract in CoinexFutureContracts:
        Contract.objects.get_or_create(
            exchange=coinexFutureExchange[0], url=contract["url"], name=contract["name"], apiIdentifier=contract["apiIdentifier"])


class Command(BaseCommand):
    def handle(self, *args, **options):
        time.sleep(10)
        create_default_exchange()
        while True:
            time.sleep(5)
            try:
                gridBots = GridBot.objects.filter(status=True)
                if not gridBots:
                    continue
                for gridBot in gridBots:
                    gridBOTkey = f"GridBot{gridBot.id}"
                    if cache.get(gridBOTkey):
                        continue
                    if not gridBot.account.checkAccount():
                        continue
                    cache.set(gridBOTkey, 1, timeout=gridBot.interval)
                    gridBot.checkOpenGrids()
                    gridBot.makeOrders()
                    gridBot.updatePositionValue()
                    GridBot.objects.filter(id=gridBot.id).update(
                        lastTimeCheck=datetime.datetime.now())
                GridBot.cachWorkerWorking()
            except Exception as e:
                print(e)
                print("200 SEC SLEEP EXEPTION")
                time.sleep(200)
