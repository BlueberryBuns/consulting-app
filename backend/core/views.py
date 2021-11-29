
import rest_framework.request as req
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from core.models import Specialization, User
from core.serializers import (
    SpecializationSerializer,
    UserSerializer,
    LoginSerializer,
    DoctorUserSerializer,
    ModeratorUserSerializer,
    DoctorSerializer,
)
from consulting_app.permissions import (
    DoctorPermission,
    ModeratorPermission,
    AdminPermission
)


class CreateModeratorAPIView(CreateAPIView):
    # Add custom permission classes
    permission_classes = [AdminPermission]
    serializer_class = ModeratorUserSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CreateDoctorAPIView(CreateAPIView):
    permission_classes = [AdminPermission|ModeratorPermission]
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


class SpecializationsAPIView(ListModelMixin, RetrieveModelMixin, GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SpecializationSerializer
    queryset = Specialization.objects.all()

    def get(self, request, *args, **kwargs):
        if kwargs.get("pk"):
            return self.retrieve(self, request, *args, **kwargs)
        if kwargs.get("contains"):
            if spec := request.data.get("spec"):
                self.queryset = self.queryset.filter(specialization__contains=spec)
                
        return self.list(request, *args, **kwargs)
    

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request: req, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        return res

class ReedeemRefreshTokenView():
    ...