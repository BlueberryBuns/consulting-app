from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from backend.core.models import User

PASSWD = "aabbcc123!"

class AuthTest(APITestCase):

    def test_user_sign_up(self):

        response = self.client.post(
            reverse("register"),
            data={
                "email": "s0m3_r4nd0m_us333r@236gfd4tap0st.com",
                "first_name": "1337Alpha123",
                "middle_names": "Bravo",
                "last_name": "Charlie",
                "password": PASSWD,
                "password_confirmation": PASSWD,
            },
        )
        user = get_user_model().objects.last()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertNotEqual(user, None)
        self.assertEqual(response.get("id"), user.id)
        self.assertEqual(response.get("email"), user.email)
        self.assertEqual(response.get("first_name"), user.first_name)
        self.assertEqual(response.get("last_name"), user.last_name)
        self.assertEqual(response.get("username"), None)

    def test_user_login(self): ...
