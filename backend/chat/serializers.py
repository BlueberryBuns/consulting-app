from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from backend.chat.models import Visit

class VisitSerializer(ModelSerializer):
    patient_id = serializers.CharField()
    doctor_id = serializers.CharField()

    class Meta:
        model = Visit

        fields = (
            "atendees",
            "status",
            "updated",
            "visit_data",
        )