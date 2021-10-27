from django.urls import path

from .views import APIView, SignUpAPIView, LoginAPIView

endpoint_name = 'users'

urlpatterns = [
    path(f"{endpoint_name}/register", SignUpAPIView.as_view(), name="register"),
    path(f"{endpoint_name}/login", LoginAPIView.as_view(), name="login"),
]
