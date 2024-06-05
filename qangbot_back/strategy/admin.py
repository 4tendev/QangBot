from django.contrib import admin
from .models import Transaction, Account, Asset, Strategy, AssetValue, CoinexFutureAccount, History, Participant, ParticipantBTCAddress,LyraAccount

admin.site.register(Account)
admin.site.register(Transaction)
admin.site.register(CoinexFutureAccount)
admin.site.register(History)
admin.site.register(Participant)
admin.site.register(Asset)
admin.site.register(Strategy)
admin.site.register(AssetValue)
admin.site.register(LyraAccount)
admin.site.register(ParticipantBTCAddress)
