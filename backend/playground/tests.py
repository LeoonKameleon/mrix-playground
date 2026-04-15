from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class MrixAuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='user123', 
            password='password123'
        )
        self.login_url = reverse('login_view')
        self.execute_url = reverse('execute_code')

    def test_login_returns_jwt_and_username(self):
        """
        Ensures that the serializer returns both the JWT tokens 
        and the correct username.
        """
        data = {"username": "user123", "password": "password123"}
        response = self.client.post(self.login_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'user123')
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_execute_code_as_guest(self):
        """
        Tests if a guest (unauthenticated user) can execute code.
        """
        data = {"code": "SAY 'Hello guest'"}
        response = self.client.post(self.execute_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_execute_code_authorized(self):
        """
        Tests if an authenticated user can execute code successfully.
        """
        self.client.force_authenticate(user=self.user)
        
        data = {"code": "SAY 'Hello user'"}
        response = self.client.post(self.execute_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_execute_code_invalid_token(self):
        """
        Tests if providing an invalid token returns 401 Unauthorized.
        """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token_string')
        data = {"code": "SAY 'Hello'"}
        response = self.client.post(self.execute_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)