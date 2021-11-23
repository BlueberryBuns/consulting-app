import functools

from uuid import uuid4
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from .utils import UserDataValidator


class CustomUserManager(BaseUserManager):

    def create_default_user(func):
        @functools.wraps(func)
        def wrapped_func(*args, **kwargs):
            email, password, first_name, last_name = UserDataValidator.validate(**kwargs)
            user = args[0].model(email=args[0].normalize_email(email))
            user.set_password(password)
            user.first_name = first_name
            user.last_name = last_name
            
            user = func(args[0], created_user=user)
            
            user.save(using=args[0]._db)
            return user
        return wrapped_func

    @create_default_user
    def create_superuser(self, email: str= None, password: str = None, first_name: str = None, last_name: str = None, **kwargs):
        if (user := kwargs.get("created_user")) is None:
            raise ValueError("Cannot create user properly, missing user object")
        user.is_staff = True
        user.is_superuser = True
        user.role = Roles.objects.get(id=Roles._Roles.ADMIN)

        return user

    @create_default_user
    def create_moderator(self, email: str= None, password: str = None, first_name: str = None, last_name: str = None, **kwargs):
        if (user := kwargs.get("created_user")) is None:
            raise ValueError("Cannot create user properly, missing user object")
        user.is_staff = True
        user.is_superuser = False
        user.role = Roles.objects.get(id=Roles._Roles.MODERATOR)

        return user

    @create_default_user
    def create_doctor(self, email: str= None, password: str = None, first_name: str = None, last_name: str = None, **kwargs):
        if (user := kwargs.get("created_user")) is None:
            raise ValueError("Cannot create user properly, missing user object")
        user.is_staff = True
        user.is_superuser = False
        user.role = Roles.objects.get(id=Roles._Roles.DOCTOR)

        return user

    @create_default_user
    def create_patient(self, email: str= None, password: str = None, first_name: str = None, last_name: str = None, **kwargs):
        if (user := kwargs.get("created_user")) is None:
            raise ValueError("Cannot create user properly, missing user object")
        user.is_staff = True
        user.is_superuser = False
        user.role = Roles.objects.get(id=Roles._Roles.PATIENT)

        return user

class Roles(models.Model):
    class Meta:
        verbose_name = "Role"
        verbose_name_plural = "Roles"

    class _Roles(models.TextChoices):
        USER = 1, _("USER")
        PATIENT = 2, _("PATIENT")
        DOCTOR = 3, _("DOCTOR")
        MODERATOR = 4, _("MODERATOR")
        ADMIN = 5, _("ADMIN")

    name = models.TextField(max_length=10, blank=False, null=False, choices=_Roles.choices)
    
    def __str__(self):
        return self.name


class Nationality(models.Model):
    class Meta:
        verbose_name = "Nationality"
        verbose_name_plural = "Nationalities"

    nationality = models.CharField(max_length=60, unique=True, null=False, blank=False)

    def __str__(self):
        return self.nationality

class User(AbstractUser):
    class Meta:
        ...

    """
        The maximum length has been selected based on article:
        https://help.salesforce.com/s/articleView?id=000322734&type=1
    """

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "middle_names",]

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    email = models.EmailField(max_length=256, unique=True)
    # roles = models.ManyToManyField(to=Roles, blank=False, null=False, choices=)
    role = models.ForeignKey(to=Roles, blank=False, null=False, 
                                on_delete=models.SET(Roles._Roles.USER),
                                default=Roles._Roles.USER)
    first_name = models.CharField(max_length=40, blank=False, null=False)
    middle_names = models.CharField(max_length=120, blank=True, null=True)
    pesel = models.CharField(max_length=11, blank=False, null=True)
    last_name = models.CharField(max_length=80)
    password = models.CharField(max_length=128)
    nationality = models.ForeignKey(to=Nationality, blank=False, null=True, on_delete=models.SET_NULL)
    doctors_id = models.OneToOneField(to=)


    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email}:{self.last_name}"

    @property
    def full_name(self):
        if self.middle_names is not None:
            return f"{self.first_name} {self.middle_names} {self.last_name}" 
        return f"{self.first_name} {self.last_name}"


class UserDirectory:
    @staticmethod
    def get_path(data_instance, filename: str) -> str:
        return f"{data_instance.uploaded_by.id}/%Y/%m/%d/{filename}"


class Image(models.Model):
    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
    photo = models.ImageField(upload_to=UserDirectory.get_path)
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(to=User, on_delete=models.DO_NOTHING)
    


# class Doctors(models.Model):
#     id = models.UUIDField(primary_key=True, null=False, unique=True, blank=False, default=uuid.uuid4)
    # LEK_MED: Final[str] = "lek. med."
    # LEK_DENT: Final[str] = "lek. dent."
    # DR_N_MED: Final[str] = "dr n. med."
    # DR_HAB_N_MED: Final[str] = "dr hab n. med."
    # PROF_DR_HAB: Final[str] = "prof. dr hab"

    # ACADEMIC_TITLES = (
    #     (LEK_MED, LEK_MED),
    #     (LEK_DENT, LEK_DENT),
    #     (DR_N_MED, DR_N_MED),
    #     (DR_HAB_N_MED, DR_HAB_N_MED),
    #     (PROF_DR_HAB, PROF_DR_HAB),
    # )

    # academic_title = models.CharField(choices=ACADEMIC_TITLES, null=False, blank=False)

# class Specializations(models.Model):
#     specialization = models.CharField(max_length=30, unique=True, blank=False, null=False)


# class AcademicTitles(models.Model):

#     class _Titles(models.TextChoices):
#         LEK_MED = "lek. med.", "lek. med."
#         LEK_DENT = "lek. dent.", "lek. dent."
#         DR_N_MED = "dr n. med.", "dr n. med."
#         DR_HAB_N_MED = "dr hab n. med.", "dr hab n. med."
#         PROF_DR_HAB = "prof. dr hab", "prof. dr hab"

    

#     title_name = models.CharField(max_length=50, choices=_Titles.choices, blank=False, null=False, default=_Titles.LEK_MED)
#     # short_name = models.CharField(max_length=22, blank=False, null=False)

# class Doctors(models.Model):
#     academic_title_id = models.ForeignKey(to=AcademicTitles, on_delete=models.SET_NULL, blank=True, null=True)
#     specializations = models.ManyToManyField(Specializations)

# class Patients(models.Model):
#     first_name = models.CharField(max_length=40, blank=False, null=False)
#     middle_names = models.CharField(max_length=120, blank=True, null=True)
#     last_name = models.CharField(max_length=80)

# class MedicalEntries(models.Model):
#     symptoms = models.CharField(max_length=1000, null=True, blank=True)
#     creation_date = models.DateTimeField(auto_now_add=True, editable=False)
#     diagnosis = models.CharField(max_length=2000, null=True, blank=True)