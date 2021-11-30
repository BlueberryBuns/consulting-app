from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import (
    User,
    Doctor,
    Specialization,
    Nationality,
    Roles,
)


# class SuperUser(DefaultUserAdmin):
#     ordering = ["id"]


admin.site.register(User)
admin.site.register(Doctor)
admin.site.register(Specialization)
admin.site.register(Nationality)
admin.site.register(Roles)