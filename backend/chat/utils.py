import hashlib
import time
from typing import TypeVar
import uuid
import functools
from dateutil.parser import parse
from rest_framework.response import Response
from django.core.exceptions import SuspiciousOperation


Visit = TypeVar("Visit")

__all__ = ("create_hash", "ParametrizedRetriveValidator")

def create_hash(key: str = uuid.uuid4()):
    hash = hashlib.sha3_512()
    hash.update(f"{time.time()}{key}".encode())
    return hash.hexdigest()

def ParametrizedRetriveValidator(error_code: int, model: Visit) -> Response:
    def retrieve_validator(func):
        @functools.wraps(func)
        def wrapping_function(*args, **kwargs):
            args[0].queryset = model.objects.filter(atendees__in=[args[1].user.id])
            if kwargs.get("pk"):
                visit = args[0].retrieve(args[1], *args, **kwargs)
                if type(visit.data["atendees"][0]) not in [str, uuid.UUID]:
                    print(type(visit.data["atendees"][0]))
                    atendee_ids = [value[key] for value in visit.data["atendees"] 
                                    for key in value if key=="id"]
                    print(str(args[1].user.id) in atendee_ids, 0)
                else:
                    atendee_ids = visit.data["atendees"]
                    print(str(args[1].user.id) in atendee_ids, 1)
                if str(args[1].user.id) in atendee_ids:
                    return visit
                return Response(
                            {"message": "You dont have access to retrieve the data",},
                            status=error_code,
                            exception=SuspiciousOperation(
                                f"User: {args[1].user.id} tried retrieve protected data"
                            )
                    )
            if date_lookup := args[1].data.get("datelookup"):
                date_lookup = parse(date_lookup)
                args[0].queryset = args[0].queryset.filter(visit_date__gte=date_lookup)
            if date_lookdown := args[1].data.pop("datelookdown", None):
                date_lookdown = parse(date_lookdown)
                print(date_lookdown)
                args[0].queryset = args[0].queryset.filter(visit_date__lte=date_lookdown)
            if user_id := args[1].data.get("user_id"):
                user_id = uuid.UUID(user_id)
                args[0].queryset = args[0].queryset.filter(atendees__in=[user_id])
            return func(*args, **kwargs)
        return wrapping_function
    return retrieve_validator

