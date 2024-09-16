from rest_framework import viewsets,status, generics
from .models import Project, Employee, WFHApplication, WFHTask
from .serializers import ProjectSerializer, EmployeeSerializer, WFHApplicationSerializer, WFHTaskSerializer,RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Or any other logic
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class WFHApplicationViewSet(viewsets.ModelViewSet):
    queryset = WFHApplication.objects.all()
    serializer_class = WFHApplicationSerializer

class WFHTaskViewSet(viewsets.ModelViewSet):
    queryset = WFHTask.objects.all()
    serializer_class = WFHTaskSerializer
