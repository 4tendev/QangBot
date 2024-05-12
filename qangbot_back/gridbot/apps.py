from django.apps import AppConfig


class GridbotConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gridbot'

    def ready(self):
        super().ready()
        from .models import Exchange, CoinexAccount, Contract
        from django.contrib.contenttypes.models import ContentType
        from django.db.models.signals import post_migrate
        from django.dispatch import receiver

        @receiver(post_migrate)
        def create_default_exchange(sender, **kwargs):
            if sender.name == 'gridbot':
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
