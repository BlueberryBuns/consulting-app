from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.encoding import (
    DjangoUnicodeDecodeError,
    smart_text,
    smart_bytes,
    force_text,
)
from django.utils.http import (
    urlsafe_base64_decode,
    urlsafe_base64_encode
)
from core.utils import EmailSender
from core.models import Doctor, Specialization, User
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    GenericAPIView
)
from core.serializers import (
    DocSerializer,
    ListUsersSerializer,
    DoctorSerializer,
    DoctorAssignSerializer,
    ModeratorAccountSerializer,
    NewPasswordSerializer,
    SpecializationSerializer,
    UserSerializer,
    LoginSerializer,
    ResetPasswordSerializer,
)
from consulting_app.permissions import (
    DoctorPermission,
    ModeratorPermission,
    AdminPermission
)

# class GetDoctorsAPIView(ListAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = DoctorSerializer

#     queryset = User.objects.exclude(doctors_id=None)

#     def get(self, request, *args, **kwargs):
#         return super().get(request, *args, **kwargs)


class GetDocsAPIView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DocSerializer

    queryset = Doctor.objects.all()

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class ListUsersAPIView(ListAPIView):
    permission_classes = [AdminPermission|ModeratorPermission]
    serializer_class = ListUsersSerializer

    queryset = User.objects.all()


    def get(self, request, *args, **kwargs):
        if uid := request.data.get("id"):
            print(f"user id: {uid}")
            self.queryset = self.queryset.filter(id__contains=uid)
        if first_name := request.data.get("first_name"):
            print(f"first_name: {first_name}")
            self.queryset = self.queryset.filter(first_name__contains=first_name)
        if last_name := request.data.get("last_name"):
            print(f"last_name: {last_name}")
            self.queryset = self.queryset.filter(last_name__contains=last_name)
        if request.data.get("is_doctor") is not None:
            if is_doc := request.data.get("is_doctor"):
                print(f"is_doctor: {is_doc}")
                self.queryset = self.queryset.filter(is_doctor=is_doc).select_related("doctors_id")
            else:
                print(f"is_doctor: {is_doc}")
                self.queryset = self.queryset.filter(is_doctor=is_doc)
        if doctors_id := request.data.get("doctors_id"):
            print(f"doctors_id: {doctors_id}")
            self.queryset = self.queryset.filter(doctors_id=doctors_id).select_related("doctors_id")

        return super().get(request, *args, **kwargs)

class CreateModeratorAPIView(CreateAPIView):
    # Add custom permission classes
    permission_classes = [AdminPermission]
    serializer_class = ModeratorAccountSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


# class CreateDoctorAPIView(CreateAPIView):
#     permission_classes = [AdminPermission|ModeratorPermission]
#     serializer_class = DoctorAccountSerializer

#     def post(self, request, *args, **kwargs):
#         return super().post(request, *args, **kwargs)


class AssignDoctorDataAPIView(CreateAPIView):
    # permission_classes = [ModeratorPermission|AdminPermission]
    permission_classes = [AllowAny]
    serializer_class = DoctorAssignSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ListDoctorAPIView(ListModelMixin, RetrieveModelMixin, GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = DoctorSerializer

    queryset = User.objects.exclude(doctors_id=None)

    def get(self, request, *args, **kwargs):
        if pk := kwargs.get("pk"):
            print(pk)
            return self.retrieve(self, request, *args, **kwargs)
        if first_name := request.data.get("first_name"):
            print(first_name)
            self.queryset = self.queryset.filter(first_name__contains=first_name)
        if last_name := request.data.get("last_name"):
            print(last_name)
            self.queryset = self.queryset.filter(last_name__contains=last_name)
        if academic_title := request.data.get("academic_title"):
            print(academic_title)
            self.queryset = self.queryset.filter(doctors_id__academic_title=academic_title)
        if specializations := request.data.get("specializations"):
            print(specializations)
            self.queryset = self.queryset.filter(
                doctors_id__specializations__in=specializations
            )

        return self.list(request, *args, **kwargs)


class SignUpAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class SpecializationsAPIView(ListModelMixin, RetrieveModelMixin, GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SpecializationSerializer
    queryset = Specialization.objects.all()

    def get(self, request, *args, **kwargs):
        if kwargs.get("pk"):
            return self.retrieve(self, request, *args, **kwargs)
        if specialization := request.data.get("specialization"):
            self.queryset = self.queryset.filter(specialization__contains=specialization)

        return self.list(request, *args, **kwargs)
    

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        return res

class PasswordResetAPIView(GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        encoded_user_id = kwargs.get("encoded_user_id")
        reset_token = kwargs.get("reset_token")
        user_id = smart_text(urlsafe_base64_decode(encoded_user_id))
        user = User.objects.get(id=user_id)

        if not PasswordResetTokenGenerator().check_token(user, reset_token):
            return Response({"message":"Token has expired or is invalid"}, status=401)

        return Response({
            "message": "Thanks for reseting password",
            "succes": True,
            "encoded_user_id": encoded_user_id,
            "reset_token": reset_token
        })


    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.get(email=serializer.data["email"])
        print(user)
        encoded_user_id = urlsafe_base64_encode(smart_bytes(user.id))
        reset_token = PasswordResetTokenGenerator().make_token(user)
        domain = get_current_site(request=request).domain
        resource_identifier = reverse(
            "reset-password", kwargs={
                "encoded_user_id": encoded_user_id,
                "reset_token": reset_token
            }
        )
        url = f"https://{domain}{resource_identifier}"
        print(url)
        email_data = {
            "to": user.email,
            "subject": "Password reset requested",
            "body": f"Click in the link to reset your password: {url}",
        }
        print(email_data)

        EmailSender.send(data=email_data)

        return Response({
            "message": "Yes, I can reset your password"
        }, status=200)
        
class UpdatePasswordAPIView(GenericAPIView):
    serializer_class = NewPasswordSerializer
    permission_classes = [AllowAny]

    queryset = get_user_model().objects.all()

    def patch(self, request, *args, **kwargs):
        encoded_user_id = request.data.get("encoded_user_id")
        user_id = force_text(urlsafe_base64_decode(encoded_user_id))
        user = get_user_model().objects.get(id=user_id)
        user.set_password(request.data["password"])
        user.save()

        return Response({"message": "Password updated"}, status=200)