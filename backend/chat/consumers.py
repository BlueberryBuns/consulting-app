import json
from typing import Optional

from channels.generic.websocket import AsyncJsonWebsocketConsumer


__all__ = ["VideoRoomChatConsumer"]


class VideoRoomChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        await self.accept()

    async def disconnect(self, code):
        return await super().disconnect(code)

    async def notify(self, event):
        await self.send_json