from django.urls import re_path

from .consumers import VideoRoomChatConsumer

websocket_urls = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', VideoRoomChatConsumer.as_asgi()),
]