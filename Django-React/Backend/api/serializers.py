from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,Profile,Project,Task,Notifications
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)  # Add role to serializer
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), required=False)
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role','project']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        project=validated_data.pop('project')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, role=role,project=project)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="profile.role")  # Assuming role is in Profile model

    class Meta:
        model = User
        fields = ['id', 'username', 'role']

    
class NoteSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username',read_only=True)
    class Meta:
        model= Note
        fields=["id","reason","description","created_at","from_date","to_date","author","status"]
        extra_kwargs={"author":{"read_only":True}}
    def validate(self, data):
        user = self.context['request'].user
        from_date = data.get('from_date')
        to_date = data.get('to_date')

        overlapping_notes = Note.objects.filter(
            author=user,
            from_date__lte=to_date,
            to_date__gte=from_date
        )
        if overlapping_notes.exists():
            raise ValidationError("A note for this date range already exists.")

        return data

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=['id','tasks_completed','hours_requested','status','date']
class TaskViewSerializer(serializers.ModelSerializer):
    author=serializers.CharField(source='note.author.username')
    class Meta:
        model=Task
        fields=['id','tasks_completed','hours_requested','status','author','date']
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'role', 'project_name','firstname','lastname','email','phone']

class NotificationSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)  # Serialize the project name
    class Meta:
        model= Notifications
        fields=['id','project_name','to','from_manager','status','message']

    def create(self, validated_data):
        # Extract the project name from the request
        project_name = self.context['request'].data.get('project')
        project = Project.objects.get(name=project_name)  # Find the project by name
        validated_data['project'] = project  # Assign the project object
        
        return super().create(validated_data)