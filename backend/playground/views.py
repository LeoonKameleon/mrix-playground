from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import CodeExecutionSerializer, RegisterSerializer, ExecutionResultSerializer
from .services import execute_code
from .models import Execution

class ExecuteCodeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data.get("code") # type: ignore
            if request.user.is_authenticated:
                execution_timeout = 60
                user = request.user
            else:
                execution_timeout = 30
                user = None
            data = execute_code(code, timeout=execution_timeout)
            execution_data = Execution(
                user=user,
                code=code,
                output=data["output"],
                status=data["status"],
                execution_time=data["execution_time"]
            )
            execution_data.save()
            output_serializer = ExecutionResultSerializer(execution_data)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Account created successfully"}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
