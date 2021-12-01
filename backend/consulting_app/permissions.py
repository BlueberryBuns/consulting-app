from rest_framework.permissions import BasePermission, IsAuthenticated

class PatientPermission(IsAuthenticated):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_patient"):
            print("patient")
            return bool(request.user and request.user.is_patient)


class DoctorPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_doctor"):
            print("doctor", bool(request.user and request.user.is_doctor), request.user)
            return bool(request.user and request.user.is_doctor)
        return False


class ModeratorPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_moderator"):
            print("moderator")
            return bool(request.user and request.user.is_moderator)
        return False


class AdminPermission(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user,"is_superuser"):
            print("admin")
            return bool(request.user and request.user.is_superuser)
        return False
