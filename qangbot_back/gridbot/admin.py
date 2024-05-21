from django.contrib import admin
from .models import Grid , GridBot , CoinexAccount , Order ,Exchange ,Contract 

class GridBotAdmin(admin.ModelAdmin):
    list_display = ("name","status","created","updated")

class GridAdmin(admin.ModelAdmin):
    list_display = ("sell","buy","size","nextPosition","status","bot","is_active")

class OrderAdmin(admin.ModelAdmin):
    list_display = ("orderID","executed","contract","created","updated")
    search_fields=("orderID","contract__name")
    list_filter=("executed",)

class ContractAdmin(admin.ModelAdmin):
    list_display = ("name","exchange")

class CoinexAccountAdmin(admin.ModelAdmin):
    list_display = ("name","user")    

admin.site.register(Grid ,GridAdmin)
admin.site.register(GridBot ,GridBotAdmin)
admin.site.register(CoinexAccount,CoinexAccountAdmin)
admin.site.register(Order ,OrderAdmin)
admin.site.register(Contract ,ContractAdmin)