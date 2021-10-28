from django.urls import re_path

from .consumers import VideoRoomChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/room/(?P<room_name>\d+)/$', VideoRoomChatConsumer.as_asgi()),
]