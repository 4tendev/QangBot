from django.contrib import admin
from .models import Account ,Asset ,Strategy,AssetValue  ,CoinexFutureAccount ,History ,Participant ,ParticipantBill ,BTCAddress

admin.site.register(Account)
admin.site.register(CoinexFutureAccount)
admin.site.register(History)
admin.site.register(Participant)
admin.site.register(Asset)
admin.site.register(Strategy)
admin.site.register(AssetValue)
admin.site.register(ParticipantBill)
admin.site.register(BTCAddress)