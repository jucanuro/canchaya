from rest_framework import serializers
from bookings.models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = [
            'id', 'court', 'client_name', 'client_phone', 
            'date', 'start_time', 'duration_hours', 
            'total_price', 'status'
        ]
        read_only_fields = ['total_price', 'status']