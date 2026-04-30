from math import radians, cos, sin, asin, sqrt
from inventory.models import Complex, Court

class SearchFinder:
    @staticmethod
    def haversine(lon1, lat1, lon2, lat2):
        """
        Calcula la distancia en km entre dos puntos geográficos (Fórmula Haversine).
        Fundamental para la App Móvil.
        """
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1 
        dlat = lat2 - lat1 
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a)) 
        r = 6371 
        return c * r

    @classmethod
    def find_courts(cls, lat=None, lon=None, sport_id=None, court_type=None):
        queryset = Court.objects.filter(is_available=True)
        
        if sport_id:
            queryset = queryset.filter(sport_id=sport_id)
        if court_type:
            queryset = queryset.filter(court_type=court_type)

        complex_ids = queryset.values_list('complex_id', flat=True).distinct()
        complexes = Complex.objects.filter(id__in=complex_ids)

        results = []
        for comp in complexes:
            comp_data = {
                'complex': comp,
                'distance': None,
                'available_courts': queryset.filter(complex=comp)
            }
            if lat and lon:
                comp_data['distance'] = cls.haversine(float(lon), float(lat), comp.longitude, comp.latitude)
            results.append(comp_data)

        # 4. Ordenamos por distancia si es posible
        if lat and lon:
            results.sort(key=lambda x: x['distance'])

        return results