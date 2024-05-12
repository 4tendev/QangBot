from django.urls import path
from . import views 
urlpatterns = [
    path('', views.bot , name = "bot"),
    path('exchange/', views.exchange , name = "exchange"),
    path('<str:exchangeName>/account/', views.account , name = "account"),
    path('<str:exchangeName>/contract/', views.contract , name = "contract"),

    
]