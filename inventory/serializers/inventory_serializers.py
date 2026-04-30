from rest_framework import serializers
from inventory.models import Sport, Complex, Court

class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name', 'icon']

class CourtSerializer(serializers.ModelSerializer):
    sport_name = serializers.ReadOnlyField(source='sport.name')
    type_display = serializers.ReadOnlyField(source='get_court_type_display')

    class Meta:
        model = Court
        fields = ['id', 'name', 'sport_name', 'type_display', 'court_type', 'price_per_hour']

class ComplexSerializer(serializers.ModelSerializer):
    courts = CourtSerializer(many=True, read_only=True)
    
    class Meta:
        model = Complex
        fields = [
            'id', 'name', 'address', 'city', 'latitude', 'longitude', 
            'main_image', 'has_parking', 'has_showers', 'courts'
        ]