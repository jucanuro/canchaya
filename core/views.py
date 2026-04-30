from django.shortcuts import render
from inventory.models import Court

def home(request):
    canchas = Court.objects.all()
    return render(request, 'index.html', {'canchas': canchas})