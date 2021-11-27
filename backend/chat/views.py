from rest_framework.permissions import AllowAny
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    RetrieveModelMixin
)
from consulting_app.permissions import (
    CustomIsAdminUser,
    PatientPermission,
    DoctorPermission,
    ModeratorPermission,
)

from chat.models import Visit

from .serializers import VisitSerializer

# Classes providing functionality for Patients
class VisitPatientAPIView(ListModelMixin,
                            CreateModelMixin,
                            UpdateModelMixin,
                            RetrieveModelMixin,
                            GenericAPIView):
    # permission_classes = [PatientPermission]
    permission_classes = [AllowAny]
    serializer_class = VisitSerializer

    queryset = Visit.objects.all()
    # queryset = Visit.objects.filter()

    def get(self, request, *args, primary_key=None, **kwargs):
        print(request.__dict__, "\nArgs: ", args, "\nkwargs: ", kwargs)
        if primary_key:
            return self.retrieve(request, *args, primary_key, **kwargs)

        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


# Classes providing functionality for Doctors
class ListUpdateVisitDoctorAPIView(RetrieveUpdateAPIView):
    # permission_classes = [DoctorPermission]
    permission_classes = [AllowAny]
    serializer_class = VisitSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

# Classes providing functionality for Moderators and Admins
class CreateVisitsModAdminAPIView(CreateAPIView):
    # permission_classes = [ModeratorPermission|CustomIsAdminUser]
    permission_classes = [AllowAny]
    serializer_class = VisitSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class RetrieveUpdateDestroyVisitsModAdminAPIView(RetrieveUpdateDestroyAPIView):
    # permission_classes = [ModeratorPermission|CustomIsAdminUser]
    permission_classes = [AllowAny]
    serializer_class = VisitSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)