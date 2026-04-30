import uuid
from django.db import models
from bookings.models import Reservation

class PaymentMethod(models.TextChoices):
    YAPE = 'YAPE', 'Yape'
    PLIN = 'PLIN', 'Plin'
    CARD = 'CARD', 'Tarjeta (Pasarela)'

class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reservation = models.OneToOneField(Reservation, on_delete=models.CASCADE, related_name='transaction')
    
    method = models.CharField(max_length=10, choices=PaymentMethod.choices)
    operation_id = models.CharField(max_length=100, unique=True, help_text="ID de operación de Yape/Plin")
    screenshot = models.ImageField(upload_to='payments/proofs/', null=True, blank=True)
    
    amount_captured = models.DecimalField(max_digits=7, decimal_places=2)
    commission_kept = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    owner_payout = models.DecimalField(max_digits=7, decimal_places=2)
    
    is_verified = models.BooleanField(default=False, help_text="Verificado por el sistema o admin")
    processed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago {self.operation_id} - {self.amount_captured}"