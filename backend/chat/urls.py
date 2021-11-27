from django.urls import path, re_path

from .views import (
    VisitPatientAPIView,
)

endpoint_name = "api"

urlpatterns = [
    # path(f"{endpoint_name}/doctor/visits", ListUpdateVisitDoctorAPIView.as_view(), name="CRUD visits for doctors"),
    path(f"{endpoint_name}/patient/visits/", VisitPatientAPIView.as_view(), name="CRUD visits for patients"),
    path(f"{endpoint_name}/patient/visits/id/<slug:pk>/", VisitPatientAPIView.as_view(), name="Retrive particular visit by PK"),
    path(f"{endpoint_name}/patient/visits/<slug:datelookup>/", VisitPatientAPIView.as_view(), name="List visit not based on date lookup"),
    # path(f"{endpoint_name}/moderator/visits", CreateModeratorAPIView.as_view(), name="moderator"),
    # path(f"{endpoint_name}/admin/visits", LoginAPIView.as_view(), name="login"),
]