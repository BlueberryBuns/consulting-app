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

def ParametrizedRetriveValidator(role: str,
                                error_code: int,
                                model: Visit) -> Response:
    def retrieve_validator(func):
        @functools.wraps(func)
        def wrapping_function(*args, **kwargs):
            if kwargs.get("pk"):
                visit = args[0].retrieve(args[1], *args, **kwargs)
                if args[1].user.id in visit.data["atendees"]:
                    return visit
                return Response(
                            {"message": "You dont have access to retrieve the data",},
                            status=error_code,
                            exception=SuspiciousOperation(
                                f"{role}: {args[1].user.id} tried retrieve protected data"
                            )
                    )
            args[0].queryset = model.objects.filter(atendees__in=[args[1].user.id])
            if date_lookup := kwargs.get("datelookup"):
                date_lookup = parse(date_lookup)
                args[0].queryset = args[0].queryset.filter(visit_date__gte=date_lookup)
            return func(*args, **kwargs)
        return wrapping_function
    return retrieve_validator

