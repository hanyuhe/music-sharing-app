# from msilib.schema import Class
from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("id","code","host","guest_can_pause","votes_to_skip","created_at")

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("guest_can_pause","votes_to_skip")

class UpdateRoomSerializer(serializers.ModelSerializer):
    # Room model's default code field is defined to be unique，redefine this to avoid problem
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ("guest_can_pause","votes_to_skip","code")