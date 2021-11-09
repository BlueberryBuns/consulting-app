from django.urls import re_path

from .consumers import VideoRoomChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/room/(?P<meeting_id>\d+)/$', VideoRoomChatConsumer.as_asgi()),
    re_path(r'chat/', VideoRoomChatConsumer.as_asgi()),
]