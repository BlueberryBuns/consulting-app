from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from chat.models import Visit

class VisitSerializer(ModelSerializer):
    class Meta:
        model = Visit
        fields = "__all__"