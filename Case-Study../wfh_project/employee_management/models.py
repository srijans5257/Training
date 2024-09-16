from django.contrib.auth.models import User
from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="employees")
    is_manager = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class WFHApplication(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    applied_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')],
        default='PENDING'
    )
    managers_notified = models.ManyToManyField(Employee, related_name='applications_reviewed')
    cancellation_request = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.employee.user.username} - {self.status}'

class WFHTask(models.Model):
    wfh_application = models.ForeignKey(WFHApplication, on_delete=models.CASCADE)
    task_description = models.TextField()
    hours_requested = models.FloatField()
    hours_approved = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f'Task for {self.wfh_application}'
