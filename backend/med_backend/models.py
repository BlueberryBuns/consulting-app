from django.db import models

# Create your models here.

class Specializations(models.Model):
    specialization = models.CharField(max_length=35, blank=False, null=False)

class Doctors(models.Model):
    specializations = models.ManyToManyField(default=None, to=Specializations)

