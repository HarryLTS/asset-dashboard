from django.urls import path, include
from . import views

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
    path('stock-view', views.stock_view),
    path('cash-view', views.cash_view),
    path('edit-log-view', views.edit_log_view),
    path('estate-view', views.estate_view)
]