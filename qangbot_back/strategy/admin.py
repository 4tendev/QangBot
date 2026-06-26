from django.contrib import admin
from .models import Transaction, Account, Asset, Strategy, AssetValue, CoinexFutureAccount, History, Participant, ParticipantBTCAddress,LyraAccount,Withdraw



from collections import defaultdict
@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    list_display = ("id", "asset_summary")

    def asset_summary(self, obj):
        totals = defaultdict(float)

        for value in obj.currentAssetValues.select_related("asset"):
            totals[value.asset.name] += value.amount

        return ", ".join(
            f"{asset}: {amount}"
            for asset, amount in totals.items()
        )

    asset_summary.short_description = "Current Assets"

admin.site.register(Account)
admin.site.register(Transaction)
admin.site.register(CoinexFutureAccount)
admin.site.register(History)
admin.site.register(Participant)
admin.site.register(Asset)
admin.site.register(AssetValue)
admin.site.register(LyraAccount)
admin.site.register(ParticipantBTCAddress)
admin.site.register(Withdraw)
