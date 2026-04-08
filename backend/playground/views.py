from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import CodeExecutionSerializer
from .services import execute_code

class ExecuteCodeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data.get("code") # type: ignore
            log = execute_code(code)
            return Response(log)
        return Response(serializer.errors, status=400)
