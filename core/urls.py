from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('registroCancha/', views.registro_cancha, name='registroCancha'),
    path('reservar/', views.reservar, name='reservar'),
    path('login/', views.login, name='login'),
    path('nosotros/', views.nosotros, name='nosotros'),
]