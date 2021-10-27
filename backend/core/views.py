from core.models import User
from core.serializers import UserSerializer

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.request import Request
from rest_framework.response import Response


class SignUpAPIView(CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    


class LoginAPIView(APIView):
    def post(self, request: Request) -> Response:
        return Response("Logged in :)")
