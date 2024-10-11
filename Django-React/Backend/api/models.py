from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
# Create your models here.
class Project(models.Model):
    name=models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
class Note(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    reason=models.CharField(max_length=100)
    description=models.TextField()
    created_at=models.DateField(auto_now_add=True)
    from_date=models.DateField(default=created_at)
    to_date=models.DateField(default=created_at)
    author=models.ForeignKey(User,on_delete=models.CASCADE,related_name="notes")
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default=PENDING  
    )

    def __str__(self) -> str:
        return self.reason

class Profile(models.Model):
    ROLE_CHOICES = [
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('admin','Admin'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firstname=models.CharField(max_length=255,blank=True,null=True)
    lastname=models.CharField(max_length=255,blank=True,null=True)
    email=models.EmailField(blank=True,null=True)
    phone=models.IntegerField(blank=True,null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return f"{self.user.username}'s Profile"

class Task(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='tasks')
    tasks_completed = models.TextField()
    hours_requested=models.IntegerField(null=True,blank=True)
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default=PENDING  
    )
    date = models.DateField(null=True,blank=True)

    def clean(self):
        if self.date < self.note.from_date or self.date > self.note.to_date:
            raise ValidationError('Date must be between the note\'s from_date and to_date.')
        if self.hours_requested:
            try:
                if float(self.hours_requested) <= 0:
                    raise ValidationError('Hours requested must be greater than 0.')
            except ValueError:
                raise ValidationError('Hours requested must be a valid number.')
    def __str__(self):
        return f"Task for Note: {self.note.reason} for {self.date}"

class Notifications(models.Model):
    STATUS_CHOICES = [
        ('Read', 'Read'),
        ('Unread', 'Unread'),
    ]
    project=models.ForeignKey(Project,on_delete=models.SET_NULL,null=True, blank=True)
    to=models.CharField(max_length=255)
    from_manager=models.CharField(max_length=255)
    status=models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Read'
    )
    message=models.CharField(max_length=255,default="xyz")