from django.urls import path
from . import views 
urlpatterns = [
    path('', views.history , name = "history"),
    path('participant/', views.participant , name = "participant"),
]