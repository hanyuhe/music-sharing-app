from django.db import models
from api.models import Room

# Create your models here.

class SpotifyToken(models.Model): # save callback token
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    # ForeignKey: store a reference to that room, if deleted the room, anything related to the ref room would be deleted
    room = models.ForeignKey(Room, on_delete=models.CASCADE) 
    