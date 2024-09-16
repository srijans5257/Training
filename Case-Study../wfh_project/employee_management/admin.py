from django.contrib import admin
from .models import Project, Employee, WFHApplication, WFHTask

admin.site.register(Project)
admin.site.register(Employee)
admin.site.register(WFHApplication)
admin.site.register(WFHTask)
