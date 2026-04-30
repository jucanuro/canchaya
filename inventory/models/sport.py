from django.db import models

class Sport(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Deporte")
    icon = models.CharField(max_length=50, help_text="Clase de FontAwesome (ej: fas fa-futbol)")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name