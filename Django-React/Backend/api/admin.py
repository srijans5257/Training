from django.contrib import admin
from .models import Note,Profile,Project,Task,Notifications
# Register your models here.
admin.site.register(Note)
admin.site.register(Profile)
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Notifications)