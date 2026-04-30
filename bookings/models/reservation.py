import uuid
from django.db import models
from inventory.models import Court

class ReservationStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pendiente de Pago'
    CONFIRMED = 'CONFIRMED', 'Confirmada'
    CANCELED = 'CANCELED', 'Cancelada'

class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    court = models.ForeignKey(Court, on_delete=models.CASCADE, related_name='reservations')
    
    client_name = models.CharField(max_length=100)
    client_phone = models.CharField(max_length=20)
    
    date = models.DateField()
    start_time = models.TimeField()
    duration_hours = models.PositiveIntegerField(default=1) 
    
    total_price = models.DecimalField(max_digits=7, decimal_places=2)
    commission_fee = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    owner_net_profit = models.DecimalField(max_digits=7, decimal_places=2)
    
    status = models.CharField(
        max_length=15, 
        choices=ReservationStatus.choices, 
        default=ReservationStatus.PENDING
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.owner_net_profit = self.total_price - self.commission_fee
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date} | {self.start_time} - {self.court.name}"