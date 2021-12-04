from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from rest_framework import fields, serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    ValidationError
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from core.models import (
    Doctor,
    Nationality,
    Specialization,
)

__all__ = ("UserSerializer", "LoginSerializer")


class SpecializationSerializer(ModelSerializer):
    class Meta:
        model = Specialization
        fields = ("specialization",)


class ListUsersSerializer(ModelSerializer):

    class Meta:
        model = get_user_model()

        fields = (
            "id",
            "email",
            "first_name",
            "middle_names",
            "last_name",
            "is_doctor",
            "doctors_id"
        )


class UserSerializer(ModelSerializer):
    password = serializers.CharField(
        write_only=True,
    )
    password_confirmation = serializers.CharField(
        write_only=True,
    )

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
        user_data = {
            key: val
            for key, val in validated_data.items()
            if key
            not in [
                "password_confirmation",
            ]
        }
        return self.Meta.model.objects.create_patient(**user_data)

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


class ModeratorAccountSerializer(UserSerializer):
    def create(self, validated_data: dict):
        user_data = {
            key: val
            for key, val in validated_data.items()
            if key
            not in [
                "password_confirmation",
            ]
        }
        return self.Meta.model.objects.create_moderator(**user_data)


class DocSerializer(ModelSerializer):
    specializations = SpecializationSerializer(many=True)

    class Meta:
        model = Doctor
        fields = (
            "id",
            "specializations",
            "academic_title",
        )

    def create(self, validated_data):
        specs_data = validated_data.pop("specializations")
        doctor = Doctor.objects.create(**validated_data)
        doctor.specializations.set(specs_data)
        doctor.save()
        return doctor


class DoctorSerializer(ModelSerializer):
    doctors_id = DocSerializer(many=False)
    class Meta:
        model = get_user_model()
        fields = (
            "first_name",
            "last_name",
            "doctors_id",
        )

class SafeUserSerializer(ModelSerializer):
    doctors_id = DocSerializer(many=False, required=False)
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "first_name",
            "last_name",
            "doctors_id",
        )


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for k, v in user_data.items():
            if k != "id":
                token[k] = v
        token["role"] = user.role_id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role_id
        data["firstName"] = self.user.first_name
        data["lastName"] = self.user.last_name
        return data

class ImageSerializer(ModelSerializer): ...

class NationalitySerializer(ModelSerializer):
    class Meta:
        model = Nationality
        fields = "__all__"

class DoctorAssignSerializer(ModelSerializer):
    user_id = serializers.CharField(write_only=True)

    class Meta:
        model = Doctor
        fields = (
            "specializations",
            "academic_title",
            "user_id"
        )

    def create(self, validated_data: dict) -> Doctor:
        specializations = validated_data.pop("specializations")
        user = validated_data.pop("user")
        instance = self.Meta.model.objects.create(**validated_data)
        instance.specializations.set(specializations)
        print(user.__dict__)
        if user.doctors_id is not None:
            raise ValueError("User already set as doctor")
        user.is_doctor = True
        user.doctors_id = instance
        user.save()
        return instance

    def validate(self, attrs):
        if title := attrs.get("academic_title"):
            assert (title, title) in Doctor._Titles.choices, "Unknown doctor title"
        if uid := attrs.pop("user_id"):
            user = get_user_model().objects.get(id=uid)
            print(user)
            attrs["user"] = user
        else:
            raise ValueError("UserID was not provided")
        return attrs


class ResetPasswordSerializer(Serializer):
    email = serializers.EmailField()

    class Meta:
        model = get_user_model()
        fields = ("email",)

    def validate(self, attrs):
        email = attrs.get("email")
        if self.Meta.model.objects.get(email=email):
            return attrs
        raise ObjectDoesNotExist

class NewPasswordSerializer(Serializer):
    password = serializers.CharField(write_only=True)
    encoded_user_id = serializers.CharField(write_only=True)
    reset_token = serializers.CharField(write_only=True)

    class Meta:
        fields = (
            "password",
            "encoded_user_id",
            "reset_token",
        )
    
    def validate(self, attrs):
        encoded_user_id = attrs.get("encoded_user_id")
        reset_token = attrs.get("reset_token")
        user_id = force_text(urlsafe_base64_decode(encoded_user_id))
        user = get_user_model().objects.get(id=user_id)
        if not PasswordResetTokenGenerator().check_token(user, reset_token):
            raise AuthenticationFailed("Invalid id and/or token")
        return super().validate(attrs)


    def update(self, instance, validated_data):
        return super().update(instance, validated_data)