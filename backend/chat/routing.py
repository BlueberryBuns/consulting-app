from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import re_path
from chat import routing

from chat.middleware import JWTAuthMiddlewareStack

from .consumers import VideoRoomChatConsumer

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AllowedHostsOriginValidator(
#         JWTAuthMiddlewareStack(
#             URLRouter(
#                 routing.websocket_urlpatterns
#             )
#         )
#     )
# })

websocket_urlpatterns = [
    re_path(r'ws/chat/room/(?P<meeting_id>\d+)/$', VideoRoomChatConsumer.as_asgi()),
    re_path(r'chat/', VideoRoomChatConsumer.as_asgi()),
]