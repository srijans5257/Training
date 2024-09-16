from django import forms
from .models import shopping_item
from django.core.exceptions import ValidationError
from django.forms import formset_factory
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from .models import customuser
class shopping_item_form(forms.ModelForm):
    class Meta:
        model = shopping_item
        fields = "__all__"
# class login_form(forms.Form):
#     username=forms.CharField(max_length=200)
#     email=forms.EmailField(max_length=200)
#     password=forms.PasswordInput()

# class UserForm(forms.Form):
#     email=forms.EmailField(max_length=200)
#     password=forms.CharField(widget=forms.PasswordInput())
#     confirm_password=forms.CharField(widget=forms.PasswordInput())
#     def clean(self):
#         cleaned_data=super().clean()
#         password=cleaned_data.get("password")
#         confirm_password=cleaned_data.get("confirm_password")
#         if password!=confirm_password:
#             raise ValidationError("Passwords don't match")
# class ProfileForm(forms.Form):
#     name=forms.CharField(max_length=200)
#     phone_number=forms.CharField(max_length=15)
#     place=forms.CharField(max_length=200)

# UserFormSet=formset_factory(UserForm,extra=1)
# ProfileFormSet=formset_factory(ProfileForm,extra=1)
# forms.py

class customuserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = customuser
        fields = ('email',)

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

    class Meta:
        model = customuser
        fields = ['old_password', 'new_password1', 'new_password2']

