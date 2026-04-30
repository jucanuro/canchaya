import uuid
from django.db import models
from django.contrib.auth.models import User

class Complex(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complexes')
    name = models.CharField(max_length=150, verbose_name="Nombre del Local")
    slug = models.SlugField(unique=True, blank=True) 
    
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default="Chiclayo")
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    payment_phone = models.CharField(max_length=15, help_text="Celular para recibir Yape/Plin")
    
    description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to='complexes/', null=True, blank=True)
    has_parking = models.BooleanField(default=False)
    has_showers = models.BooleanField(default=False)

    def __str__(self):
        return self.name