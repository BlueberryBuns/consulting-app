from django.contrib import admin

# Register your models here.

from .models import (
    MedicalEntry,
    Prescription,
)

admin.site.register(MedicalEntry)
admin.site.register(Prescription)
