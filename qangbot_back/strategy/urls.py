from django.urls import path
from . import views
urlpatterns = [
    path('<int:strategyID>/history/', views.history, name="history"),
    path('participant/', views.participant, name="participant"),
    path('participant/deposit/', views.deposit, name="participant"),
    path('participant/withdraw/', views.withdraw, name="withdraw"),

]
