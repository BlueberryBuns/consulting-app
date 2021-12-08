from datetime import datetime
from dateutil.tz import tzutc
from rest_framework.serializers import ModelSerializer
from core.serializers import ListUsersSerializer, SafeUserSerializer
from chat.models import Visit

class SafeListVisitSerializer(ModelSerializer):

    atendees = ListUsersSerializer(many=True)

    class Meta:
        model = Visit
        fields = (
            "id",
            "status",
            "secret",
            "creation_date",
            "updated",
            "visit_date",
            "atendees",
        )

class SafeCheckVisitSerializer(ModelSerializer):
    class Meta:
        model = Visit
        fields = (
            "visit_date",
        )

class UnsafeListVisitSerializer(ModelSerializer):

    atendees = ListUsersSerializer(many=True)

    class Meta:
        model = Visit
        fields = (
            "id",
            "status",
            "secret",
            "creation_date",
            "updated",
            "visit_date",
            "atendees",
        )

class StandardVisitSerializer(ModelSerializer):

    class Meta:
        model = Visit
        fields = (
            "id",
            "status",
            "secret",
            "creation_date",
            "updated",
            "visit_date",
            "atendees",
        )

    def create(self, validated_data: dict) -> Visit:
        atendees = validated_data.pop("atendees")
        visit = self.Meta.model.objects.create(**validated_data)
        visit.atendees.set(atendees)
        return visit

    def validate(self, attrs: dict) -> dict:
        if atendees := attrs.get("atendees"):
            assert len(atendees) == 2, "System currently support only two atendees"
        if date := attrs.get("visit_date"):
            assert datetime.now(tz=tzutc()) <= date, "Cannot set visit in the past"
        return attrs

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
