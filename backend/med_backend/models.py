from django.db import models

from core.models import User, Doctor

class MedicalEntry(models.Model):
    class Meta:
        verbose_name_plural = "Medical Entries"

    symptoms = models.CharField(max_length=2000, null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    diagnosis = models.CharField(max_length=2000, null=True, blank=True)
    doctors_id = models.ForeignKey(to=Doctor, on_delete=models.DO_NOTHING, blank=False, null=False)
    patients_id = models.ForeignKey(to=User, on_delete=models.DO_NOTHING, blank=False, null=False)

class Prescription(models.Model):
    prescribed_drugs = models.CharField(max_length=500, blank=True, null=True)
    recommendation = models.CharField(max_length=500, blank=True, null=True)
    medical_entrys_id = models.ForeignKey(to=MedicalEntry, blank=False, null=True, on_delete=models.DO_NOTHING)

