from django.urls import path, re_path

from .views import (
    ListVisitPatientDoctorAPIView,
    VisitAPIView,
    VisitAdminAPIView,
    VisitDoctorAPIView,
    VisitPatientAPIView,
    VisitModeratorAPIView,
)

endpoint_name = "api"

urlpatterns = [
    # Patient is finished, TESTED 
    path(f"{endpoint_name}/patient/visits/", 
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/id/<slug:pk>/",
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/update/<slug:pk>/",
        VisitPatientAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/create/",
        VisitPatientAPIView.as_view()),

    # Doctor is finished, TESTED
    path(f"{endpoint_name}/doctor/visits/",
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/id/<slug:pk>/",
        ListVisitPatientDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/list",
        VisitDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/update/<slug:pk>/",
        VisitDoctorAPIView.as_view()),

    # Moderator is finished, TESTED
    path(f"{endpoint_name}/moderator/visits/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/id/<slug:pk>/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/list/",
        VisitAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/list/<slug:pk>/",
        VisitAPIView.as_view()),

    # Admin is finished, TESTED
    path(f"{endpoint_name}/admin/visits/",
        VisitAdminAPIView.as_view()),
    path(f"{endpoint_name}/admin/visits/id/<slug:pk>/",
        VisitAdminAPIView.as_view()),    
    path(f"{endpoint_name}/admin/visits/list/",
        VisitAPIView.as_view()),
    path(f"{endpoint_name}/admin/visits/list/<slug:pk>/",
        VisitAPIView.as_view()),
]