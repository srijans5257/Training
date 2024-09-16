from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import shopping_item
from django.contrib.auth.models import User
from .forms import shopping_item_form
# login_form, UserForm, ProfileForm, UserFormSet, ProfileFormSet
from django.shortcuts import redirect
from django.contrib.auth import authenticate,login,logout,update_session_auth_hash
from .decorators import checksuperuser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import shopping_itemSerializer
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import customuserCreationForm,CustomAuthenticationForm,CustomPasswordChangeForm
# Create your views here.
@login_required(login_url='login')
def home(request):
  return render(request,'home.html')
@login_required(login_url='login')
def item_list(request):
  items=shopping_item.objects.all()
  return render(request,'item_list.html',{'items':items})
@login_required(login_url='login')
def form(request):
  if request.method == 'POST':
        form = shopping_item_form(request.POST)
        if form.is_valid():
            form.save()
            return redirect('item_list')
  else:
        form = shopping_item_form()
  return render(request,'form.html',{'form': form})
# def login_view(request):
#   if request.method == 'POST':
#             username=request.POST.get('username')
#             email=request.POST.get('email')
#             password=request.POST.get('password')
#             user=authenticate(request,username=username,email=email,password=password)
#             if user is not None:
#                 auth_login(request,user)
#                 return redirect('home')
#             else:
#                 return render(request,'login.html',{'error': 'Invalid entry'})
#   return render(request,'login.html')
# def signup_view(request):
#     if request.method=='POST':
#         user_formset=UserFormSet(request.POST,prefix='user')
#         profile_formset=ProfileFormSet(request.POST,prefix='profile')
#         if user_formset.is_valid() and profile_formset.is_valid():
#             user_data=user_formset.cleaned_data[0]
#             profile_data=profile_formset.cleaned_data[0]

#             user=User.objects.create_user(
#                 username=profile_data['name'],
#                 email=user_data['email'],
#                 password=user_data['password']
#             )
#             return redirect('login')
#     else:
#         user_formset=UserFormSet(prefix='user')
#         profile_formset=ProfileFormSet(prefix='profile')
#     return render(request,'signup.html',{
#         'user_formset': user_formset,
#         'profile_formset': profile_formset
#     })
# views.py


def signup_view(request):
    if request.method == 'POST':
        form = customuserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(email=email, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = customuserCreationForm()
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        else:
            redirect('login')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'login.html', {'form': form})

@login_required
def change_password(request):
    if request.method == 'POST':
        form = CustomPasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('change_password')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = CustomPasswordChangeForm(request.user)
    return render(request, 'change_password.html', {'form': form})


def logout_view(request):
    logout(request)
    return render(request,'logout.html')

@login_required(login_url='login')
@checksuperuser
def admin_only(request):
    return HttpResponse("Superuser only view")

@login_required(login_url='login')
@api_view(['GET'])
def apioverview(request):
    api_urls={
        'Create':'/task-create/',
        'Read':'/task-read/',
        'Update':'/task-update/',
        'Delete':'/task-Delete/',
    }
    return Response(api_urls)

@login_required(login_url='login')
@api_view(['GET'])
def read(request):
    items=shopping_item.objects.all()
    serializer=shopping_itemSerializer(items, many=True)
    return Response(serializer.data)

@login_required(login_url='login')
@checksuperuser
@api_view(['POST'])
def create(request):
    serializer=shopping_itemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@login_required(login_url='login')
@api_view(['POST'])
def update(request,pk):
    item=shopping_item.objects.get(id=pk)
    serializer=shopping_itemSerializer(instance=item,data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@login_required(login_url='login')
@api_view(['DELETE'])
def delete(request,pk):
    item=shopping_item.objects.get(id=pk)
    item.delete()
    return Response(f'item {pk} deleted')