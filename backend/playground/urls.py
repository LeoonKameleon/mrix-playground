from django.urls import path
from .views import ExecuteCodeView, RegisterView, LoginView
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

urlpatterns = [
    path("execute/", ExecuteCodeView.as_view(), name="execute_code"),
    path("auth/register/", RegisterView.as_view(), name="register_view"),
    path("auth/login/", LoginView.as_view(), name="login_view"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", TokenBlacklistView.as_view(), name="token_blacklist")
]