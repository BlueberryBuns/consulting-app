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
        fields = (
            "atendees",
            "visit_date",
            "status",
        )

    def create(self, validated_data: dict) -> Visit:
        return self.Meta.model.objects.create(**validated_data)

    def validate(self, attrs: dict) -> dict:
        if atendees_list := attrs.get("atendees"):
            assert len(atendees_list) == 2, "System currently support only two atendees"
        if date := attrs.get("visit_date"):
            print(type(date))
            assert datetime.now(tz=tzutc()) >= parse_date(date), \
                "Future visits do not belong in the past"
        return attrs

    # def 