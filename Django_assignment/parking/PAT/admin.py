from django.contrib import admin
from .models import ParkingHistory,ParkingSpace,User
# Register your models here.
admin.site.register(ParkingSpace)
admin.site.register(ParkingHistory)
admin.site.register(User)