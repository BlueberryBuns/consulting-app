from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import SignUpAPIView, LoginAPIView

endpoint_name = "users"

urlpatterns = [
    path(f"{endpoint_name}/register", SignUpAPIView.as_view(), name="register"),
    path(f"{endpoint_name}/login", LoginAPIView.as_view(), name="login"),
    path(f"{endpoint_name}/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path(f"{endpoint_name}/token/verify", TokenVerifyView.as_view(), name="verify"),
]
