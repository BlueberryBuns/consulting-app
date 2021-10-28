import json
from asgiref.sync import async_to_sync

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from webrtc_utils import ChatUtils

__all__ = ["VideoRoomChatConsumer"]


class VideoRoomChatConsumer(AsyncJsonWebsocketConsumer):
    chat_groups = []

    async def connect(self) -> None:
        print("User Connected!")
        # self.user = self.scope["user"]
        self.id = self.scope["url_route"]['kwargs']['meeting_id']
        self.room_group_name = f"consulting_room_{self.id}"
        self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        print("User Disconnected!")
        await super().disconnect(code)
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")

        self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send.message",
                "message": message
            }
        )

    async def send_message(self, event):
        message = event.get("message")

        self.send(text_data=json.dumps({
            'message': message
        }))

