from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def registro_cancha(request):
    return render(request, 'registroCancha.html')

def reservar(request):
    return render(request, 'reservar.html')

def login(request):
    return render(request, 'login.html')

def nosotros(request):
    return render(request, 'nosotros.html')

def perfil(request):
    return render(request, 'perfil.html')

def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')