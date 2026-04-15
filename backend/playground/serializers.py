from rest_framework import serializers, validators
from django.contrib.auth.models import User
from .models import Execution
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CodeExecutionSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, allow_blank=False)

class ExecutionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execution
        fields = ['id', 'code', 'output', 'status', 'execution_time', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, 
        validators=[
            validators.UniqueValidator(
                queryset=User.objects.all(), 
                message="E-mail address taken"
            )
        ]
    )
    
    password = serializers.CharField(required=True, allow_blank=False, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
    

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["username"] = self.user.username

        return data