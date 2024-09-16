from django.http import HttpResponseForbidden
from functools import wraps

def checksuperuser(func):
    @wraps(func)
    def _wrapped_func(request,*args,**kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return HttpResponseForbidden("Unauthorized")
        return func(request,*args,**kwargs)
    return _wrapped_func
