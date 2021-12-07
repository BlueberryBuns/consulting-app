from datetime import date
import time
import functools
import json
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from dateutil.parser import parse
from datetime import datetime
from django.core.exceptions import SuspiciousOperation
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    ListAPIView,
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
    AdminPermission,
    PatientPermission,
    DoctorPermission,
    ModeratorPermission,
)

from .models import Visit
from .serializers import (
    StandardVisitSerializer,
    SafeListVisitSerializer,
    SafeCheckVisitSerializer,
    UnsafeListVisitSerializer,
)

from .utils import ParametrizedRetriveValidator


class SafeVisitCheckApiView(ListAPIView):
    permission_classes = [PatientPermission]
    serializer_class = SafeCheckVisitSerializer

    queryset = Visit.objects.all()

    def get(self, request, *args, **kwargs):
        if doc_id := request.GET.get("doctorid", ""):
            user = get_user_model().objects.get(id=doc_id)
            if user is not None:
                if not user.is_doctor:
                    return Response({"message": "You dont have access to retrieve the data",},
                                status=403,
                                exception=SuspiciousOperation(
                                f"User: {request.user.id} tried retrieve protected data"
                            ))
            self.queryset = self.queryset.filter(atendees__in=[doc_id])
        if date_lookup := request.GET.get("datelookup", ""):
            self.queryset = self.queryset.filter(visit_date__gte=date_lookup)
        if date_lookdown := request.GET.get("datelookdown", ""):
            self.queryset = self.queryset.filter(visit_date__lte=date_lookdown)

        
        return self.list(request, *args, **kwargs)


class ListVisitPatientDoctorAPIView(RetrieveModelMixin,
                                ListModelMixin,
                                GenericAPIView):
    permission_classes = [PatientPermission]
    serializer_class = SafeListVisitSerializer

    @ParametrizedRetriveValidator(error_code=413, model=Visit)
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class UpdateCreateVisitPatientAPIView(CreateModelMixin,
                            UpdateModelMixin,
                            RetrieveModelMixin,
                            ListModelMixin,
                            GenericAPIView):
    
    '''Class providing functionality for Patients'''
    
    permission_classes = [PatientPermission]
    serializer_class = StandardVisitSerializer

    queryset = Visit.objects.all()

    def validateUpdate(func):
        @functools.wraps(func)
        def wrapping_function(*args, **kwargs):
            args[0].queryset = Visit.objects.filter(atendees__in=[args[1].user.id])
            if args[1].data.get("atendees"):
                return Response(
                    {"message":"Patients cannot change meeting atendees",},
                    status=419,
                    exception=SuspiciousOperation(
                        f"Patient {args[1].user.id} tried to change atendees"
                    )
                )
            if status := args[1].data.get("status"):
                if status not in ["CANCELED"]:
                    return Response(
                        {"message":"Invalid meeting status set by patient",},
                        status=421,
                        exception=SuspiciousOperation(
                            f"Invalid status: {status} set by patient {args[1].user.id}"
                        )
                    )
            if args[1].data.get("visit_date"):
                return Response(
                        {"message": "Patient cannot change date of meeting",},
                        status=422,
                        exception=SuspiciousOperation(
                            f"Patient: {args[1].user.id} tried changing visit date"
                        )
                    )
            return func(*args, **kwargs)
        return wrapping_function

    @validateUpdate
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @validateUpdate
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        d = request.data
        if d.get("status"):
            return Response(
                    {"message": "Invalid data",},
                    status=400,
                    exception=SuspiciousOperation(
                        f"Patient: {request.user.id} tried to self confirm visit"
                    )
                )
        if str(request.user.id) not in [usr for usr in request.data["atendees"]]:
            return Response(
                    {"message": "Invalid data",},
                    status=400,
                    exception=SuspiciousOperation(
                        f"Patient: {request.user.id} tred to organise vsit for other users"
                    )
                )
        return self.create(request, *args, **kwargs)


class VisitDoctorAPIView(ListModelMixin,
                            CreateModelMixin,
                            UpdateModelMixin,
                            RetrieveModelMixin,
                            GenericAPIView):

    '''Classes providing functionality for Doctors'''

    permission_classes = [DoctorPermission]
    serializer_class = StandardVisitSerializer

    queryset = Visit.objects.all()

    def validateUpdate(func):
        @functools.wraps(func)
        def wrapping_function(*args, **kwargs):
            args[0].queryset = Visit.objects.filter(atendees__in=[args[1].user.id])
            if atendees := args[1].data.get("atendees"):
                if args[1].user.id not in atendees:
                    return Response(
                        {"message":"Requesting user does not appear in atendees",},
                        status=430,
                        exception=SuspiciousOperation(
                            f"Invalid operation: user {args[1].user.id} not in atendees"
                        )
                    )
            if status := args[1].data.get("status"):
                if status not in ["CANCELED", "CONFIRMED", "STARTED", "FINISHED"]:
                    return Response(
                        {"message":"Invalid meeting status set by doctor",},
                        status=431,
                        exception=SuspiciousOperation(
                            f"Invalid status: {status} set by doctor {args[1].user.id}"
                        )
                    )
            return func(*args, **kwargs)
        return wrapping_function

    @validateUpdate
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @validateUpdate
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    @ParametrizedRetriveValidator(error_code=432, model=Visit)
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class VisitAPIView(ListModelMixin,
                    RetrieveModelMixin,
                    GenericAPIView):
    permission_classes = [ModeratorPermission|AdminPermission]
    serializer_class = UnsafeListVisitSerializer

    queryset = Visit.objects.all()

    def get(self, request, *args, **kwargs):
        if kwargs.get("pk"):
            return self.retrieve(request, *args, **kwargs)
        if date_lookup := request.data.pop("datelookup", None):
            date_lookup = parse(date_lookup)
            self.queryset = self.queryset.filter(visit_date__gte=date_lookup)
        if date_lookdown := request.data.pop("datelookdown", None):
            date_lookdown = parse(date_lookdown)
            self.queryset = self.queryset.filter(visit_date__lte=date_lookdown)
        if user_id := request.data.pop("user_id", None):
            self.queryset = Visit.objects.filter(atendees__in=[user_id])
        return self.list(request, *args, **kwargs)


class VisitModeratorAPIView(VisitAPIView,
                            UpdateModelMixin,
                            CreateModelMixin):
    permission_classes = [ModeratorPermission|AdminPermission]
    serializer_class = StandardVisitSerializer

    queryset = Visit.objects.all()

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)