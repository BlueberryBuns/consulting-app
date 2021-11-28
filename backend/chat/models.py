import uuid

from django.db import models

from .utils import create_hash

from core.models import User
from django.utils.translation import gettext_lazy as _

class Visit(models.Model):

    class _Status(models.TextChoices):
        ORDERED = "ORDERED", _("ORDERED")
        CONFIRMED = "CONFIRMED", _("CONFIRMED")
        CANCELED = "CANCELED", _("CANCELED")
        STARTED = "STARTED", _("STARTED")
        FINISHED = "FINISHED", _("FINISHED")

        __empty__ = _("UNKNOWN")

    id = models.UUIDField(primary_key=True, editable=False ,default=uuid.uuid4)
    secret = models.CharField(max_length=128, default=create_hash, blank=False, null=False, editable=False, auto_created=True)
    status = models.CharField(choices=_Status.choices, default=_Status.ORDERED, max_length=10, auto_created=True)
    creation_date = models.DateTimeField(auto_now_add=True, null=False, blank=False, editable=False)
    updated = models.DateTimeField(auto_now=True, blank=False, null=False)
    atendees = models.ManyToManyField(User)
    visit_date = models.DateTimeField(blank=False, null=False)
    
    def __str__(self):
        return f"{self.visit_date}-{self.id}"
