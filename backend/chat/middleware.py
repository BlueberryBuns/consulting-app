from urllib.parse import parse_qs as parse_querystring
import logging
from django.contrib.auth.models import AnonymousUser as Guest

from core.models import User
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from channels.auth import AuthMiddleware
from django.db import close_old_connections

logger = logging.Logger(f"{__name__}")

@database_sync_to_async
def receive_user_from_db(scope):
    close_old_connections()
    url_query = parse_querystring(scope["query_string"].decode())
    # logger.warning(f"[{logger.name.upper()}]: URL query: {url_query}")
    token = url_query.get('token')
    if token is None:
        logger.warning(f"[{logger.name.upper()}]:Token is missing")
        return Guest()
    try:
        access = AccessToken(token[0])
        # logger.warning(f"[{logger.name.upper()}]: access token: {access}")
        user = User.objects.get(id=access.get("id"))    
    except:
        logger.warning(f"[{logger.name.upper()}]: User not found")
        return Guest()
    if user.is_active:
        # logger.warning(f"[{logger.name.upper()}]: USER user.is_active: {user.is_active}")
        return user
    return Guest()


class JWTAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope["user"]._wrapped = await receive_user_from_db(scope)

def JWTAuthMiddlewareStack(inner_scope):
    return CookieMiddleware(SessionMiddleware(JWTAuthMiddleware(inner_scope)))