__all__ = ['UserDataValidator',]

class UserValueError(ValueError): ...


class UserDataValidator:
    @classmethod
    def validate(cls, **kwargs):
        email = kwargs.get("email")
        password = kwargs.get("password")
        first_name = kwargs.get("first_name")
        last_name = kwargs.get("last_name")

        if not email:
            raise UserValueError("Cannot create user without email!")
        if not password:
            raise UserValueError("Cannot create user without password!")
        if not first_name:
            raise UserValueError("Cannot create user without first name!")
        if not last_name:
            raise UserValueError("Cannot create user without last name!")

        return email, password, first_name, last_name