import rest_framework.request as req
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from core.models import User
from core.serializers import (
    UserSerializer,
    LoginSerializer,
    DoctorUserSerializer,
    ModeratorUserSerializer
)
from consulting_app.permissions import (
    DoctorPermission,
    ModeratorPermission,
    CustomIsAdminUser
)


class CreateModeratorAPIView(CreateAPIView):
    # Add custom permission classes
    permission_classes = [CustomIsAdminUser]
    serializer_class = ModeratorUserSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CreateDoctorAPIView(CreateAPIView):
    permission_classes = [CustomIsAdminUser or ModeratorPermission]
    serializer_class = DoctorUserSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class SignUpAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)
    

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request: req, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        return res

class ReedeemRefreshTokenView():
    ...