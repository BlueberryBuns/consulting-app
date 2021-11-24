from rest_framework import response
import rest_framework.request as req
from rest_framework_simplejwt import authentication
from core.models import User
from rest_framework.generics import GenericAPIView
from core.serializers import UserSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.generics import CreateAPIView


class CreateModeratorAPIView(CreateAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = UserSerializer
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CreateDoctorAPIView(CreateAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = UserSerializer
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class SignUpAPIView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)
    authentication_classes = []
    permission_classes = []
    serializer_class = UserSerializer
    queryset = User.objects.all()


class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request: req, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        return res

class ReedeemRefreshTokenView():
    ...