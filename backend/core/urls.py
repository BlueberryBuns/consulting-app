from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import (
    ListUsersAPIView,
    ListDoctorAPIView,
    SignUpAPIView,
    LoginAPIView,
    AssignDoctorDataAPIView,
    CreateModeratorAPIView,
    SpecializationsAPIView,
    GetDocsAPIView,
    GetDoctorsAPIView
)

endpoint_name = "api"

urlpatterns = [
    path(f"{endpoint_name}/register", SignUpAPIView.as_view(), name="register"),
    path(f"{endpoint_name}/login", LoginAPIView.as_view(), name="login"),

    path(f"{endpoint_name}/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path(f"{endpoint_name}/token/verify", TokenVerifyView.as_view(), name="verify"),

    path(f"{endpoint_name}/accounts/get", ListUsersAPIView.as_view()),
    path(f"{endpoint_name}/get", GetDocsAPIView.as_view()),
    path(f"{endpoint_name}/doctors/get", GetDoctorsAPIView.as_view()),



    path(f"{endpoint_name}/doctors", ListDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctors/<slug:query>", ListDoctorAPIView.as_view()),
    path(f"{endpoint_name}/accounts/create/doctor", AssignDoctorDataAPIView.as_view(), name="doctor"),
    path(f"{endpoint_name}/accounts/create/moderator", CreateModeratorAPIView.as_view(), name="moderator"),
    path(f"{endpoint_name}/specializations", SpecializationsAPIView.as_view()),
    path(f"{endpoint_name}/specializations/id/<int:pk>", SpecializationsAPIView.as_view()),
    path(f"{endpoint_name}/specializations/<slug:contains>", SpecializationsAPIView.as_view()),
]
