from django.contrib import admin
from .models import Account ,Asset ,Strategy,AssetValue  ,CoinexFutureAccount

admin.site.register(Account)
admin.site.register(CoinexFutureAccount)

admin.site.register(Asset)
admin.site.register(Strategy)
admin.site.register(AssetValue)