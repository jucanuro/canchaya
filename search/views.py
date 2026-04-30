from rest_framework import viewsets, response
from search.services.finder import SearchFinder
from search.serializers.search_serializers import SearchResultSerializer

class GlobalSearchViewSet(viewsets.ViewSet):
    """
    Endpoint principal para el buscador.
    No requiere login. Soporta filtros por GPS, deporte y tipo.
    """
    def list(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        sport_id = request.query_params.get('sport_id')
        court_type = request.query_params.get('court_type')

        results = SearchFinder.find_courts(
            lat=lat, lon=lon, 
            sport_id=sport_id, 
            court_type=court_type
        )
        
        serializer = SearchResultSerializer(results, many=True)
        return response.Response(serializer.data)