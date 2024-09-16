from django.shortcuts import render,redirect
from django.contrib.auth import login,authenticate
from .forms import UserCreationForm, UserLoginForm
from django.contrib import messages
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ParkingSpaceSerializer
from django.db.models import Sum
from .models import ParkingSpace,User,ParkingHistory
import random
from django.utils import timezone
# Create your views here.
@api_view(['GET'])
def availability(request):
    user=request.user
    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=401)
    if user.role=='Admin':
        total_twa=ParkingSpace.objects.aggregate(total_twa=Sum('twa'))['total_twa'] or 0
        total_fwa = ParkingSpace.objects.aggregate(total_fwa=Sum('fwa'))['total_fwa'] or 0
        return Response(
            {
                'total_two_wheeler_available':total_twa,
                'total_four_wheeler_available':total_fwa
            }
        )
    elif user.role == "Public":
        total_twa = ParkingSpace.objects.aggregate(total_twa=Sum('twa'))['total_twa'] or 0
        total_fwa = ParkingSpace.objects.aggregate(total_fwa=Sum('fwa'))['total_fwa'] or 0
        return Response({
            'two_wheeler_available': total_twa > 0,
            'four_wheeler_available': total_fwa > 0
        })
    else:
        return Response("Unauthorized")

@api_view(['POST'])
def Assign(request):
    vehicle_category=request.data.get('vehicle_category')
    vehicle_number=request.data.get('vehicle_number')
    parking_level=request.data.get('parking_level')
    if not vehicle_category or not vehicle_number or not parking_level:
        return Response("error: Missing required fields")
    try:
        parking_space = ParkingSpace.objects.get(level=parking_level)
    except ParkingHistory.DoesNotExist:
        return Response("error: Parking level does not exist")
    if vehicle_category=='tw':
        if parking_space.twa<=0:
            return Response("No parking space available at this level")
        available=list(range(1,parking_space.twa +1))
    elif vehicle_category=='fw':
        if parking_space.fwa<=0:
            return Response("No parking space available at this level")
        available=list(range(1,parking_space.fwa +1))
    else:
        return Response("Invalid vehicle_category")
    parking_lot=random.choice(available)

    now=timezone.now()
    fee=0.0
    parking_history=ParkingHistory(
        level=parking_level,
        type=vehicle_category,
        vehicle_number=vehicle_number,
        Lot=parking_lot,
        Fee=fee,
        In=now,
    )
    parking_history.save()

    if vehicle_category == 'tw':
        parking_space.twa -= 1
    elif vehicle_category == 'fw':
        parking_space.fwa -= 1
    parking_space.save()
    
    response_data = {
        'type': vehicle_category,
        'vehicle_number': vehicle_number,
        'level': parking_level,
        'Lot': parking_lot,
        'In': now,
        'fee': fee
    }
    return Response(response_data)

@api_view(['POST'])
def unlock(request):
    vehicle_number=request.data.get('vehicle_number')
    Lot=request.data.get('lot')
    if ParkingHistory.objects.get(Lot=Lot).vehicle_number!=vehicle_number:
        return Response("Invalid Entry")
    out=timezone.now()
    parking_history=ParkingHistory.objects.get(vehicle_number=vehicle_number,Lot=Lot)
    parking_space = ParkingSpace.objects.get(level=parking_history.level)
    if parking_history.type=='tw':
        parking_space.twa +=1
    elif parking_history.type=='fw':
        parking_space.fwa +=1
    parking_space.save()
    parking_history.Out=out
    parking_history.save()
    response_data = {
        'vehicle_number': vehicle_number,
        'parking_lot': Lot,
        'locking_time':parking_history.In,
        'unlocking_time': out,
        'fee': 10*((out-parking_history.In)/3600)
    }
    return Response(response_data)

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'User registered successfully.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data.get('name')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=name, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = UserLoginForm()
    return render(request, 'login.html', {'form': form})

def home(request):
    return render(request, 'home.html')