from django.urls import path
from . import views 
urlpatterns = [
    path('', views.auth , name = "authentication"),
    path('vip/', views.vip , name = "vip"),
    path('vip/update/', views.updateVIP , name = "updatevip"),
    path('totp/', views.updateTOTP , name = "updateTOTP"),
]
