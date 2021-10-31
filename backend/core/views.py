from rest_framework import response
import rest_framework.request as req
from rest_framework_simplejwt import authentication
from core.models import User
from rest_framework.generics import GenericAPIView
from core.serializers import UserSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.generics import CreateAPIView


class SignUpAPIView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)
    authentication_classes = []
    permission_classes = []
    serializer_class = UserSerializer
    queryset = User.objects.all()


class LoginAPIView(TokenObtainPairView):
    def post(self, request: req, *args, **kwargs):
        print(request.data.get("email"))
        queryset = User.objects.get(email=request.data.get("email"))
        res = super().post(request, *args, **kwargs)

        username_str = " ".join([queryset.__dict__["first_name"],
                queryset.__dict__["middle_names"],
                queryset.__dict__["last_name"]])

        res.data["username"] = username_str
        return res
    # print(queryset)
    serializer_class = LoginSerializer

class ReedeemRefreshTokenView():
    ...