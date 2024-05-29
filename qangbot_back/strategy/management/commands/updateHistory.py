from django.core.management.base import BaseCommand
import time
from strategy.models import Strategy, asstUSDRate, History
from django.utils import timezone
from django.core.cache import cache


def getHistoryDate(history: History):
    return {
        "id": history.id,
        "btcROI": history.btcROI,
        "ethROI": history.ethROI,
        "usdROI": history.usdROI,
        "date":  history.date
    }


class Command(BaseCommand):
    def handle(self, *args, **options):
        time.sleep(1)
        try:
            strategies = Strategy.objects.all()
            if strategies:
                for strategy in strategies:
                    currentUSDValue = strategy.currentUSDValue()
                    print(currentUSDValue)

                    currentETHValue = currentUSDValue / asstUSDRate("ETH")
                    time.sleep(5)
                    currentBTCValue = currentUSDValue / asstUSDRate("BTC")
                    time.sleep(5)

                    baseUSD, baseETH, baseBTC = strategy.baseAssetValues.get(
                        asset__name="USD").amount, strategy.baseAssetValues.get(
                        asset__name="ETH").amount, strategy.baseAssetValues.get(asset__name="BTC").amount

                    today_date = timezone.now().today().date()

                    USDROI = round(100*((currentUSDValue/baseUSD) - 1), 0)
                    ETHROI = round(100*((currentETHValue/baseETH) - 1), 0)
                    BTCROI = round(100*((currentBTCValue/baseBTC) - 1), 0)

                    history = History.objects.filter(date=today_date)
                    if history:
                        history = history[0]
                        history.ethROI = ETHROI
                        history.btcROI = BTCROI
                        history.usdROI = USDROI
                        history.strategy = strategy
                        history.save()
                    else:
                        History.objects.create(
                            ethROI=ETHROI, date=today_date, btcROI=BTCROI, usdROI=USDROI, strategy=strategy)
                    
                    strategy.cachHistory()

        except Exception as e:
            print(e)
        print("OK STRATEGT script")
