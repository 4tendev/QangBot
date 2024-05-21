from django.urls import path
from . import views 
urlpatterns = [
    path('', views.gridbots , name = "gridbots"),
    path('exchange/', views.exchanges , name = "exchanges"),
    path('<str:exchangeName>/account/', views.accounts , name = "accounts"),
    path('<str:exchangeName>/contract/', views.contracts , name = "contracts"),
    path('<int:id>/', views.gridbot , name = "gridbot"),
    path('<int:botID>/grids/', views.grids , name = "grids"),

    
]