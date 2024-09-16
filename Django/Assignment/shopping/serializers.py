from rest_framework import serializers
from .models import shopping_item

class shopping_itemSerializer(serializers.ModelSerializer):
    class Meta:
        model=shopping_item
        fields='__all__'