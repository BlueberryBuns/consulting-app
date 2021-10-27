from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError

from django.contrib.auth import get_user_model

from core.models import User


class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()

        fields = (
            "id",
            "email",
            "first_name",
            "middle_names",
            "last_name",
            "password",
            "password_confirmation",
        )

        kwargs = {
            "id": {"read_only": True},
            "password": {"write_only": True},
            "password_confirmation": {"write_only": True},
        }

    def create(self, validated_data: dict):
        password = validated_data.pop("password")

        user_data = {
            key: val for key, val in validated_data.items()
            if key not in ["password_confirmation",] 
        }

        instance = self.Meta.model(**user_data)

        if password is not None:
            instance.set_password(password)
        
        print(instance)
        instance.save()
        return instance

    def validate(self, attrs: dict) -> dict:
        _password = attrs.get("password")
        _password_conf = attrs.get("password_confirmation")

        if _password is None:
            raise ValidationError("Password cannot be empty")

        if _password_conf is None:
            raise ValidationError("Password confirmation cannot be empty")

        if _password_conf != _password:
            raise ValidationError("Passwords must match!")

        del _password_conf 
        del _password
        return attrs
