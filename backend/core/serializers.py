from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model

__all__ = ("UserSerializer", "LoginSerializer")


class UserSerializer(ModelSerializer):
    password = serializers.CharField(
        write_only=True,
    )
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
            key: val
            for key, val in validated_data.items()
            if key
            not in [
                "password_confirmation",
            ]
        }

        instance = self.Meta.model(**user_data)

        if password is not None:
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, attrs: dict) -> dict:
        _password = attrs.get("password")
        _password_conf = attrs.get("password_confirmation")

        if _password is None:
            raise ValidationError("Password cannot be empty")

        elif _password_conf is None:
            raise ValidationError("Password confirmation cannot be empty")

        elif _password_conf != _password:
            raise ValidationError("Passwords must match!")

        del _password_conf
        del _password
        return attrs


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for k, v in user_data.items():
            if k != "id":
                token[k] = v
        return token
