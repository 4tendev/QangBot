from django.urls import path
from . import views 
urlpatterns = [
    path('', views.bot , name = "bot"),
    path('exchange/', views.exchange , name = "exchange"),
    
]