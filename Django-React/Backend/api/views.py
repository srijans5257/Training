from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,NoteSerializer,UserProfileSerializer,ProjectSerializer,TaskSerializer,ProfileSerializer,TaskViewSerializer,NotificationSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Note,Project,Profile,Task,Notifications
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q
# Create your views here.

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class=NoteSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        # print(self.request.user)
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteListCreateManagerPending(generics.ListCreateAPIView):
    serializer_class=NoteSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        try:
            project = user.profile.project
            return Note.objects.filter(author__profile__project=project,status="pending")
        except Profile.DoesNotExist:
            return Note.objects.none()
class NoteListCreateManagerAccepted(generics.ListCreateAPIView):
    serializer_class=NoteSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        try:
            project = user.profile.project
            return Note.objects.filter(author__profile__project=project,status="accepted")
        except Profile.DoesNotExist:
            return Note.objects.none()
class NoteListCreateManagerRejected(generics.ListCreateAPIView):
    serializer_class=NoteSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        try:
            project = user.profile.project
            return Note.objects.filter(author__profile__project=project,status="rejected")
        except Profile.DoesNotExist:
            return Note.objects.none()
class NoteStatusUpdate(generics.UpdateAPIView):
    queryset=Note.objects.all()
    serializer_class=NoteSerializer
    permission_classes=[AllowAny]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        status = request.data.get("status")

        if status and status in [Note.PENDING, Note.ACCEPTED, Note.REJECTED]:
            instance.status = status
            instance.save()

            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            return Response({"error": "Invalid status"}, status=400)


class NoteDelete(generics.DestroyAPIView):
    serializer_class=NoteSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        user=self.request.user
        return Note.objects.filter(author=user)

class TaskCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        selected_date = self.kwargs['date']
        note_id = self.kwargs['note_id']
        return Task.objects.filter(note_id=note_id,date=selected_date)

    def perform_create(self, serializer):
        note_id = self.kwargs['note_id']
        selected_date=self.kwargs['date']
        note = Note.objects.get(id=note_id)
        serializer.save(note=note,date=selected_date)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes=[IsAuthenticated]
    def get_object(self):
        task_id = self.kwargs['pk']
        return Task.objects.get(id=task_id)

    def put(self, request, *args, **kwargs):
        task = self.get_object()
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        task = self.get_object()
        task.delete()
        return Response({"message": "Task deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class UserProfileView2(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=kwargs['username'])
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

class UpdateUserProfileView(generics.RetrieveUpdateAPIView):
    queryset=Profile.objects.all()
    serializer_class=ProfileSerializer
    permission_classes=[IsAuthenticated]

    def get_object(self):
        username = self.kwargs['username']
        return Profile.objects.get(user__username=username)

    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class TaskView(generics.ListAPIView):
    serializer_class=TaskViewSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        project = user.profile.project
        return Task.objects.filter(note__author__profile__project=project)
    
class ProfileManagerView(generics.ListAPIView):
    serializer_class=ProfileSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        project=user.profile.project
        return Profile.objects.filter(project=project).filter(role="employee")

class ProfileAdminView(generics.ListAPIView):
    serializer_class=ProfileSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        project=user.profile.project
        return Profile.objects.filter(project=project).filter(Q(role="employee") | Q(role="manager"))

class roleChangeView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = TaskSerializer
    permission_classes=[IsAuthenticated]

    def put(self, request, *args, **kwargs):
        task = self.get_object()
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NotificationEmployeeView(generics.ListAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        user=self.request.user
        return Notifications.objects.filter(to=user,status='Unread')

class NotificationManagerView(generics.ListAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        project=self.request.user.profile.project
        return Notifications.objects.filter(project=project,status="Unread")
    
class NotificationCreateView(generics.CreateAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]
    def create(self, request, *args, **kwargs):
        data = {
            'project': request.data.get('project'), 
            'to': request.data.get('to'),
            'from_manager': request.data.get('from_manager'),
            'status': request.data.get('status', 'Unread'),
            'message': request.data.get('message', 'No message provided'), 
        }

        serializer = self.get_serializer(data=data,context={'request':request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class NotificationUpdateView(generics.UpdateAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        notif_id = self.kwargs['pk']
        return Notifications.objects.filter(id=notif_id)
    def put(self, request, *args, **kwargs):
        notif = self.get_object()
        serializer = NotificationSerializer(notif, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
