import functools

from uuid import uuid4
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser
from django.db.models.deletion import DO_NOTHING
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from .utils import UserDataValidator

class CustomUserManager(BaseUserManager):

    def create_default_user(func):
        @functools.wraps(func)
        def wrapped_func(*args, **kwargs):
            email, password, first_name, middle_names, last_name = UserDataValidator.validate(**kwargs)
            user = args[0].model(email=args[0].normalize_email(email))
            user.set_password(password)
            user.first_name = first_name
            user.last_name = last_name
            user.middle_names = middle_names
            
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
        user.is_moderator = True
        user.role = Roles.objects.get(id=Roles._Roles.MODERATOR)

        return user

    @create_default_user
    def create_doctor(self, email: str= None, password: str = None, first_name: str = None, last_name: str = None, **kwargs):
        if (user := kwargs.get("created_user")) is None:
            raise ValueError("Cannot create user properly, missing user object")
        user.is_doctor = True
        user.role = Roles.objects.get(id=Roles._Roles.DOCTOR)

        return user

    @create_default_user
    def create_patient(self, email: str= None, password: str = None, first_name: str = None, last_name: str = None, **kwargs):
        if (user := kwargs.get("created_user")) is None:
            raise ValueError("Cannot create user properly, missing user object")
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

    

class Specialization(models.Model):
    class Meta:
        verbose_name = "Specialization"
    specialization = models.CharField(max_length=35, blank=False, null=False)

    def __str__(self):
        return self.specialization


class Doctor(models.Model):
    class _Titles(models.TextChoices):
        UNKNOWN = "", ""
        MGR = "mgr.", "mgr."
        LEK_MED = "lek. med.", "lek. med."
        LEK_DENT = "lek. dent.", "lek. dent."
        DR_N_MED = "dr n. med.", "dr n. med."
        DR_HAB_N_MED = "dr hab n. med.", "dr hab n. med."
        PROF_DR_HAB = "prof. dr hab", "prof. dr hab"

    specializations = models.ManyToManyField(default=None, to=Specialization)
    academic_title = models.TextField(choices=_Titles.choices, default=_Titles.UNKNOWN)

    def __str__(self):
        return "Doctor"

class User(AbstractBaseUser, PermissionsMixin):

    """
        The maximum length has been selected based on article:
        https://help.salesforce.com/s/articleView?id=000322734&type=1
    """

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "middle_names",]

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    email = models.EmailField(_('email address'),max_length=256, unique=True)
    role = models.ForeignKey(to=Roles, blank=False, null=False, 
                                on_delete=models.SET(Roles._Roles.USER),
                                default=Roles._Roles.USER)
    first_name = models.CharField(max_length=40, blank=False, null=False)
    middle_names = models.CharField(_('middle names'),max_length=120, blank=True, null=True)
    pesel = models.CharField(max_length=11, blank=False, null=True)
    last_name = models.CharField(_('last name'),max_length=80)
    password = models.CharField(_('password'),max_length=128)
    nationality = models.ForeignKey(to=Nationality, blank=False, null=True, on_delete=models.SET_NULL)
    doctors_id = models.OneToOneField(to=Doctor, blank=True, null=True, on_delete=DO_NOTHING)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    is_moderator = models.BooleanField(_('moderator status'), default=False)
    is_doctor = models.BooleanField(_('checks user doctor status'), default=False)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    
    objects = CustomUserManager()
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f"{self.email}:{self.last_name}"

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    @property
    def full_name(self):
        if self.middle_names is not None:
            return f"{self.first_name} {self.middle_names} {self.last_name}" 
        return f"{self.first_name} {self.last_name}".strip()


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
