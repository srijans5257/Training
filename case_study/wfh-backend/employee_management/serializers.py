from rest_framework import serializers
from .models import Project, Employee, WFHApplication, WFHTask
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = User.objects.filter(username=data['username']).first()
        if user and user.check_password(data['password']):
            refresh = RefreshToken.for_user(user)
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }
        raise serializers.ValidationError('Invalid credentials')

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class WFHApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WFHApplication
        fields = ['id', 'employee', 'project', 'status', 'applied_on', 'cancellation_request', 'managers_notified']
        depth = 2  # Include related employee and user fields

class WFHTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = WFHTask
        fields = '__all__'

