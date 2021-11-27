from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    DestroyAPIView,
    UpdateAPIView
)

from consulting_app.permissions import (
    CustomIsAdminUser,
    DoctorPermission,
    ModeratorPermission,
)

from chat.models import Visit

# Classes providing functionality for Patients
class ListVisitPatientApiView(ListAPIView):
    permissions_class = [IsAuthenticated]


class CreateVisitPatientApiView(CreateAPIView):
    permissions_class = [IsAuthenticated]


class UpdateVisitPatientApiView(DestroyAPIView):
    permissions_class = [IsAuthenticated]


# Classes providing functionality for Doctors
class ListVisitDoctorApiView(ListAPIView):
    permissions_class = [DoctorPermission]


class UpdateVisitDoctorApiView(UpdateAPIView):
    permissions_class = [DoctorPermission]


# Classes providing functionality for Moderators and Admins
class ListVisitsModAdminApiView(ListAPIView):
    permissions_class = [ModeratorPermission or CustomIsAdminUser]


class UpdateVisitsModAdminApiView(UpdateAPIView):
    permissions_class = [ModeratorPermission or CustomIsAdminUser]


class DeleteVisitsModAdminApiView(DestroyAPIView):
    permissions_class = [ModeratorPermission or CustomIsAdminUser]


class CreateVisitsModAdminApiView(CreateAPIView):
    permissions_class = [ModeratorPermission or CustomIsAdminUser]



