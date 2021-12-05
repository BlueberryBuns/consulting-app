from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import (
    ListUsersAPIView,
    ListDoctorAPIView,
    PasswordResetAPIView,
    SignUpAPIView,
    LoginAPIView,
    AssignDoctorDataAPIView,
    CreateModeratorAPIView,
    SpecializationsAPIView,
    GetDocsAPIView,
    # GetDoctorsAPIView,
    UpdatePasswordAPIView,
    UserRole
)

endpoint_name = "api"

urlpatterns = [
    # Tested was ok
    path(f"{endpoint_name}/register/", SignUpAPIView.as_view(), name="register"),
    path(f"{endpoint_name}/login/", LoginAPIView.as_view(), name="login"),

    # Tested and corrected
    path(f"{endpoint_name}/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path(f"{endpoint_name}/token/verify/", TokenVerifyView.as_view(), name="verify"),
    path(f"{endpoint_name}/role/", UserRole.as_view(), name="verify"),
    # Tested and corrected
    path(f"{endpoint_name}/doctors/", ListDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctors/<slug:pk>/", ListDoctorAPIView.as_view()),

    # Tested it might be missing some endpoints
    path(f"{endpoint_name}/accounts/", ListUsersAPIView.as_view()),
    path(f"{endpoint_name}/accounts/reset-password/", PasswordResetAPIView.as_view()),
    path(f"{endpoint_name}/accounts/set-password/", UpdatePasswordAPIView.as_view()),
    path(f"{endpoint_name}/accounts/reset-password/<slug:encoded_user_id>/<slug:reset_token>/",
        PasswordResetAPIView.as_view(),
        name="reset-password",
    ),

    path(f"{endpoint_name}/accounts/doctor/", AssignDoctorDataAPIView.as_view(), name="doctor"),
    path(f"{endpoint_name}/accounts/moderator/", CreateModeratorAPIView.as_view(), name="moderator"),
    
    path(f"{endpoint_name}/specializations/", SpecializationsAPIView.as_view()),
    path(f"{endpoint_name}/specializations/<int:pk>/", SpecializationsAPIView.as_view()),
    # path(f"{endpoint_name}/specializations/name-contains/<slug:contains>/", SpecializationsAPIView.as_view()),
]
