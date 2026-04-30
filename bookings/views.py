from rest_framework import viewsets, status, response
from .models import Reservation
from .serializers import ReservationSerializer # Deberás crearlo en serializers.py
from inventory.models import Court

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        court_id = request.data.get('court')
        duration = int(request.data.get('duration_hours', 1))
        
        try:
            court = Court.objects.get(id=court_id)
        except Court.DoesNotExist:
            return response.Response({"error": "Cancha no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        total_price = court.price_per_hour * duration
        
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(total_price=total_price)
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)