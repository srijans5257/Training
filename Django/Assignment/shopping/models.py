from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.utils.translation import gettext_lazy as _
# Create your models here.
class shopping_item(models.Model):
    name=models.CharField(max_length=100)
    price=models.FloatField(validators=[MinValueValidator(0.0)])
    Discount=models.IntegerField(validators=[MinValueValidator(0)])

class customusermanager(BaseUserManager):
    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError("The Email field must be sent")
        email=self.normalize_email(email)
        user=self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        return self.create_user(email,password,**extra_fields)

class customuser(AbstractBaseUser,PermissionsMixin):
    email=models.EmailField(unique=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=True)
    is_superuser = models.BooleanField(_('superuser status'), default=True)
    objects=customusermanager()
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=[]
