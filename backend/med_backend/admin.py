from django.contrib import admin

# Register your models here.

from .models import (
    Specialization,
    Doctor,
    MedicalEntry,
    Prescription,
)


admin.site.register(Doctor)
admin.site.register(MedicalEntry)
admin.site.register(Prescription)
admin.site.register(Specialization)