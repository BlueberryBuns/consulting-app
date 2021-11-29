from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import (
    SignUpAPIView,
    LoginAPIView,
    CreateDoctorAPIView,
    CreateModeratorAPIView,
    SpecializationsAPIView
)

endpoint_name = "api"

urlpatterns = [
    path(f"{endpoint_name}/register", SignUpAPIView.as_view(), name="register"),
    path(f"{endpoint_name}/login", LoginAPIView.as_view(), name="login"),
    path(f"{endpoint_name}/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path(f"{endpoint_name}/token/verify", TokenVerifyView.as_view(), name="verify"),
    path(f"{endpoint_name}/accounts/create/doctor", CreateDoctorAPIView.as_view(), name="doctor"),
    path(f"{endpoint_name}/accounts/create/moderator", CreateModeratorAPIView.as_view(), name="moderator"),
    # path(f"{endpoint_name}/get/doctors/", CreateModeratorAPIView.as_view()),
    # path(f"{endpoint_name}/get/doctor/<slug:pk>/", CreateModeratorAPIView.as_view()),
    # path(f"{endpoint_name}/get/users/", CreateModeratorAPIView.as_view()),
    # path(f"{endpoint_name}/get/user/<slug:pk>/", CreateModeratorAPIView.as_view()),
    path(f"{endpoint_name}/specializations", SpecializationsAPIView.as_view()),
    path(f"{endpoint_name}/specializations/id/<int:pk>", SpecializationsAPIView.as_view()),
    path(f"{endpoint_name}/specializations/<slug:contains>", SpecializationsAPIView.as_view()),

]
