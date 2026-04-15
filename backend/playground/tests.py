from typing import Any, Dict, cast
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.response import Response
from django.contrib.auth.models import User

class MrixAuthTests(APITestCase):
    client: APIClient

    def setUp(self):
        self.user = User.objects.create_user(
            username='user123', 
            password='password123'
        )
        self.login_url = reverse('login_view')
        self.execute_url = reverse('execute_code')

    def test_login_returns_jwt_and_username(self):
        data = {"username": "user123", "password": "password123"}
        response = cast(Response, self.client.post(self.login_url, data))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        resp_data = cast(Dict[str, str], response.data)
        
        self.assertEqual(resp_data['username'], 'user123')
        self.assertIn('access', resp_data)
        self.assertIn('refresh', resp_data)

    def test_execute_code_as_guest(self):
        """
        Tests if a guest (unauthenticated user) can execute code.
        """
        data = {"code": "SAY 'Hello guest'"}
        response = cast(Response, self.client.post(self.execute_url, data))
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_execute_code_authorized(self):
        """
        Tests if an authenticated user can execute code successfully.
        """
        self.client.force_authenticate(user=self.user)
        
        data = {"code": "SAY 'Hello user'"}
        response = cast(Response, self.client.post(self.execute_url, data))
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_execute_code_invalid_token(self):
        """
        Tests if providing an invalid token returns 401 Unauthorized.
        """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token_string')
        
        data = {"code": "SAY 'Hello'"}
        response = cast(Response, self.client.post(self.execute_url, data))
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)