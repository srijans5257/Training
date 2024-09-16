from rest_framework import serializers
from .models import ParkingSpace,ParkingHistory
class ParkingSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model=ParkingSpace
        fields='__all__'
class ParkingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingHistory
        fields = ['level', 'type', 'vehicle_number', 'lot', 'fee', 'in_time', 'out_time']