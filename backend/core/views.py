from core.models import User
from core.serializers import UserSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.generics import CreateAPIView


class SignUpAPIView(CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
