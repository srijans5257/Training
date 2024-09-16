from django.contrib import admin

# Register your models here.
from .models import shopping_item,customuser 
    
admin.site.register(shopping_item)
admin.site.register(customuser)