from django.contrib.auth.base_user import BaseUserManager
from django.db import models

from django.contrib.auth.models import AbstractUser


class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, password: str):
        if not email:
            raise ValueError("Cannot create user without password!")
        if not password:
            raise ValueError("Cannot create user without password!")

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.is_admin = False
        user.is_staff = False
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str):
        if not email:
            raise ValueError("Cannot create user without password!")
        if not password:
            raise ValueError("Cannot create user without password!")

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    def __str__(self):
        return f"Object {__name__}: {self.__dict__.items()}"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    username = None
    first_name = models.CharField(max_length=100)
    middle_names = models.CharField(max_length=255)
    email = models.EmailField(max_length=100, unique=True)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    objects = CustomUserManager()
