from django.urls import path

from .views import (
    VisitPatientAPIView,
)

endpoint_name = "api"

urlpatterns = [
    # path(f"{endpoint_name}/doctor/visits", ListUpdateVisitDoctorAPIView.as_view(), name="CRUD visits for doctors"),
    path(f"{endpoint_name}/patient/visits", VisitPatientAPIView.as_view(), name="CRUD visits for patients"),
    # path(f"{endpoint_name}/moderator/visits", CreateModeratorAPIView.as_view(), name="moderator"),
    # path(f"{endpoint_name}/admin/visits", LoginAPIView.as_view(), name="login"),
]