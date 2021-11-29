from rest_framework.permissions import BasePermission, IsAuthenticated

class PatientPermission(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view)

class DoctorPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_doctor"):
            return bool(request.user and request.user.is_doctor)
        return False

class ModeratorPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_moderator"):
            return bool(request.user and request.user.is_moderator)
        return False

class AdminPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_superuser"):
            return bool(request.user and request.user.is_superuser)
        return False
