from rest_framework.permissions import BasePermission

class DoctorPermission(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_doctor)

class ModeratorPermission(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_moderator)

class CustomIsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)
