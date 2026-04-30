from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import Profile

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class PrivateProfileSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'role', 'role_display', 'phone', 'created_at', 'updated_at']
        read_only_fields = ['id', 'role', 'created_at', 'updated_at'] # No se pueden cambiar vía API