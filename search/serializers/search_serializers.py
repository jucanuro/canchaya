from rest_framework import serializers
from inventory.serializers.inventory_serializers import ComplexSerializer, CourtSerializer

class SearchResultSerializer(serializers.Serializer):
    complex = ComplexSerializer()
    distance = serializers.FloatField(allow_null=True)
    available_courts = CourtSerializer(many=True)
    min_price = serializers.SerializerMethodField()

    def get_min_price(self, obj):
        prices = [c.price_per_hour for c in obj['available_courts']]
        return min(prices) if prices else 0