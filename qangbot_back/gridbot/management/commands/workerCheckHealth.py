from django.core.management.base import BaseCommand
import time
from gridbot.models import GridBot
from gridbot.redeploy import redeploy



class Command(BaseCommand):
    def handle(self, *args, **options):
            time.sleep(10)
            try:
                if not GridBot.checkWorkerWorking() :
                    redeploy()
                print("BOT HEALTHY")
            except Exception as e:
                print(e)

