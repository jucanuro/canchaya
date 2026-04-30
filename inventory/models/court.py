import uuid
from django.db import models
from .sport import Sport
from .complex import Complex

class Court(models.Model):
    COURT_TYPES = [
        ('5x5', 'Fútbol 5'),
        ('6x6', 'Fútbol 6'),
        ('7x7', 'Fútbol 7'),
        ('8x8', 'Fútbol 8'),
        ('11x11', 'Fútbol 11'),
        ('voley', 'Voley standard'),
        ('multi', 'Multiusos'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complex = models.ForeignKey(Complex, on_delete=models.CASCADE, related_name='courts')
    sport = models.ForeignKey(Sport, on_delete=models.PROTECT)
    
    name = models.CharField(max_length=100, help_text="Ej: Cancha 1 - Techada")
    court_type = models.CharField(max_length=10, choices=COURT_TYPES)
    
    price_per_hour = models.DecimalField(max_digits=7, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.complex.name} - {self.name} ({self.get_court_type_display()})"