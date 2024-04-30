from django.contrib import admin
from .models import Grid , GridBot , CoinexAccount , Order ,Exchange ,Contract
admin.site.register(Grid)
admin.site.register(GridBot)
admin.site.register(CoinexAccount)
admin.site.register(Order)
admin.site.register(Exchange)
admin.site.register(Contract)