__all__ = ['UserDataValidator',]

from typing import Tuple
from django.core.mail import EmailMessage
from django.core.mail import send_mail


class UserValueError(ValueError): ...


class EmailSender:
    def send(data: dict, *args, **kwargs) -> None:
        email = EmailMessage(
            subject=data.get("subject"),
            body=data.get("body"),
            to=[data.get("recipent")]
        )
        print(email.send())
        print(send_mail(
            subject=data.get("subject"),
            message=data.get("body"),
            recipient_list=[data.get("recipent")],
            fail_silently=False,
            from_email=None
        ))
        

class UserDataValidator:
    @classmethod
    def validate(cls, **kwargs) -> Tuple[str, str, str, str, str]:
        email = kwargs.get("email")
        password = kwargs.get("password")
        first_name = kwargs.get("first_name")
        last_name = kwargs.get("last_name")
        middle_names = kwargs.get("middle_names")

        if not email:
            raise UserValueError("Cannot create user without email!")
        if not password:
            raise UserValueError("Cannot create user without password!")
        if not first_name:
            raise UserValueError("Cannot create user without first name!")
        if not last_name:
            raise UserValueError("Cannot create user without last name!")

        return email, password, first_name, middle_names, last_name