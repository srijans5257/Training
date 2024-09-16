from typing import Any
from django.shortcuts import redirect
from django.urls import reverse
class RestrictionMiddleware:
    def __init__(self,get_response):
        self.get_response=get_response
    def __call__(self, request):
        allowed_paths={
            reverse('login'),
            reverse('signup'),
            reverse('logout'),
        }
        if request.path not in allowed_paths and not request.user.is_authenticated:
            return redirect('login')
        response=self.get_response(request)
        return response
    