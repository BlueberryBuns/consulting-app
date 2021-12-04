from django.urls import path, re_path

from .views import (
    ListVisitPatientDoctorAPIView,
    VisitAPIView,
    # VisitAdminAPIView,
    VisitDoctorAPIView,
    UpdateCreateVisitPatientAPIView,
    VisitModeratorAPIView,
)

endpoint_name = "api"

urlpatterns = [
    # Patient is finished, TESTED 
    # path(f"{endpoint_name}/patient/visits/",
    #     VisitPatientAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/details/", 
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/details/<slug:pk>/",
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/<slug:pk>/",
        UpdateCreateVisitPatientAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/",
        UpdateCreateVisitPatientAPIView.as_view()),

    # Doctor is finished, TESTED
    path(f"{endpoint_name}/doctor/visits/details/",
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/details/<slug:pk>/",
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/<slug:pk>/",
        VisitDoctorAPIView.as_view()),

    # Moderator is finished, TESTED
    path(f"{endpoint_name}/moderator/visits/details/",
        VisitAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/details/<slug:pk>/",
        VisitAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/<slug:pk>/",
        VisitModeratorAPIView.as_view()),
]