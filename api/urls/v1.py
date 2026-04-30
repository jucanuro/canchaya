from django.urls import path, include
from rest_framework.routers import DefaultRouter
from search.views import GlobalSearchViewSet
from bookings.views import BookingViewSet

router = DefaultRouter()
router.register(r'explore', GlobalSearchViewSet, basename='explore')
router.register(r'bookings', BookingViewSet, basename='bookings')

urlpatterns = [
    path('', include(router.urls)),
]