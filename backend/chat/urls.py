from django.urls import path, re_path

from .views import (
    VisitAdminAPIView,
    VisitDoctorAPIView,
    VisitPatientAPIView,
    VisitModeratorAPIView,
)

endpoint_name = "api"

urlpatterns = [
    path(f"{endpoint_name}/patient/visits/", 
        VisitPatientAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/id/<slug:pk>/",
        VisitPatientAPIView.as_view()),
    path(f"{endpoint_name}/patient/visits/date/<slug:datelookup>/",
        VisitPatientAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/",
        VisitDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/id/<slug:pk>/",
        VisitDoctorAPIView.as_view()),
    path(f"{endpoint_name}/doctor/visits/date/<slug:datelookup>/",
        VisitDoctorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/id/<slug:pk>/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/date/<slug:datelookup>/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/moderator/visits/user/<slug:userid>/date/<slug:datelookup>/",
        VisitModeratorAPIView.as_view()),
    path(f"{endpoint_name}/admin/visits/",
        VisitAdminAPIView.as_view()),
    path(f"{endpoint_name}/admin/visits/id/<slug:pk>/",
        VisitAdminAPIView.as_view()),
    path(f"{endpoint_name}/admin/visits/date/<slug:datelookup>/",
        VisitAdminAPIView.as_view()),
    path(f"{endpoint_name}/admin/visits/user/<slug:userid>/date/<slug:datelookup>/",
        VisitAdminAPIView.as_view()),
    
]