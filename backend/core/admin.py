from django.contrib import admin

# Register your models here.
from .models import User
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin


# class SuperUser(DefaultUserAdmin):
#     ordering = ["id"]


admin.site.register(User)