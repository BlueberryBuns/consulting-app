from rest_framework.permissions import AllowAny
from dateutil.parser import parse
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

    def get(self, request, *args, **kwargs):
        self.queryset = Visit.objects.filter(atendees__in=[request.user.id])
        if kwargs.get("id"):
            return self.retrieve(request, *args, **kwargs)
        if date_lookup := kwargs.get("datelookup"):
            date_lookup = parse(date_lookup)
            self.queryset = self.queryset.filter(visit_date__gte=date_lookup)

        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        print(kwargs, args)
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


# # Classes providing functionality for Doctors
# class ListUpdateVisitDoctorAPIView(RetrieveUpdateAPIView):
#     # permission_classes = [DoctorPermission]
#     permission_classes = [AllowAny]
#     serializer_class = VisitSerializer

#     def get(self, request, *args, **kwargs):
#         return super().get(request, *args, **kwargs)

#     def put(self, request, *args, **kwargs):
#         return super().put(request, *args, **kwargs)

# # Classes providing functionality for Moderators and Admins
# class CreateVisitsModAdminAPIView(CreateAPIView):
#     # permission_classes = [ModeratorPermission|CustomIsAdminUser]
#     permission_classes = [AllowAny]
#     serializer_class = VisitSerializer

#     def create(self, request, *args, **kwargs):
#         return super().create(request, *args, **kwargs)


# class RetrieveUpdateDestroyVisitsModAdminAPIView(RetrieveUpdateDestroyAPIView):
#     # permission_classes = [ModeratorPermission|CustomIsAdminUser]
#     permission_classes = [AllowAny]
#     serializer_class = VisitSerializer

#     def get(self, request, *args, **kwargs):
#         return super().get(request, *args, **kwargs)

#     def put(self, request, *args, **kwargs):
#         return super().put(request, *args, **kwargs)

#     def patch(self, request, *args, **kwargs):
#         return super().patch(request, *args, **kwargs)

#     def delete(self, request, *args, **kwargs):
#         return super().delete(request, *args, **kwargs)