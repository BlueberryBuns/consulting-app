from datetime import datetime
from dateutil.parser import parse as parse_date
from dateutil.tz import tzutc
from django.db.models import fields
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from chat.models import Visit
from core.models import User

class ListVisitSerializer(ModelSerializer):
    class Meta:
        model = Visit,
        fields = "__all__"

class VisitSerializer(ModelSerializer):

    class Meta:
        model = Visit
        fields = "__all__"

    def create(self, validated_data: dict) -> Visit:
        atendees = validated_data.pop("atendees")
        instance = self.Meta.model.objects.create(**validated_data)
        instance.atendees.set(atendees)
        return instance

    def validate(self, attrs: dict) -> dict:
        if atendees := attrs.get("atendees"):
            assert len(atendees) == 2, "System currently support only two atendees"
        if date := attrs.get("visit_date"):
            assert datetime.now(tz=tzutc()) <= date, "Cannot set visit in the past"
        return attrs

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
