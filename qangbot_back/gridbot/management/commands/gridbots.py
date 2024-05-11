from django.core.management.base import BaseCommand
import time
import redis
from gridbot.models import GridBot
from core.settings import REDIS_URL

redis_client = redis.from_url(REDIS_URL, decode_responses=True)





class Command(BaseCommand):
    def handle(self, *args, **options):
        time.sleep(60)
        while True:
            time.sleep(5)
            try:
                gridBots = GridBot.objects.filter(status=True)
                if not gridBots:
                    continue
                for gridBot in gridBots:
                    gridBOTkey = f"GridBot {gridBot.id}"
                    if redis_client.get(gridBOTkey):
                        continue
                    if not gridBot.account.checkAccount():
                        continue
                    redis_client.setex(gridBOTkey, gridBot.interval, 1)
                    gridBot.checkOpenGrids()
                    gridBot.makeOrders()
            except Exception as e:
                print(e)
                print("200 SEC SLEEP EXEPTION")
                time.sleep(200)
