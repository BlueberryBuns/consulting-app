from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from backend.chat.models import Visit

class VisitSerializer(ModelSerializer):
    patient_id = serializers.CharField()
    doctor_id = serializers.CharField()

    class Meta:
        model = Visit

        fields = (
            "id",
            "patient_id",
            "doctor_id"
        )

        kwargs = {
            "id": {"read_only": True},
        }

    def create(self, validated_data: dict):


        return self.Meta.model(**validated_data)

    def validate(self, attrs: dict) -> dict:
        return super().validate(attrs)