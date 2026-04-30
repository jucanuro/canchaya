from datetime import datetime, timedelta
from .models import Reservation

class AvailabilityService:
    @staticmethod
    def is_court_available(court_id, date, start_time, duration):
        """
        Verifica si hay cruces de horarios.
        Nivel Senior: Maneja rangos de tiempo.
        """
        end_time = (datetime.combine(date, start_time) + timedelta(hours=duration)).time()
        
        overlapping_reservations = Reservation.objects.filter(
            court_id=court_id,
            date=date,
            status='CONFIRMED'
        ).filter(
            models.Q(start_time__lt=end_time) & models.Q(start_time__gte=start_time)
        )
        
        return not overlapping_reservations.exists()