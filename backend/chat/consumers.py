import json
from asgiref.sync import async_to_sync

from channels.generic.websocket import AsyncJsonWebsocketConsumer, AsyncWebsocketConsumer

__all__ = ["VideoRoomChatConsumer"]


class UserAvaliableNotificationConsumer(AsyncJsonWebsocketConsumer):
    ...


class VideoRoomChatConsumer(AsyncJsonWebsocketConsumer):
    """
    General flow:
    1. create or join room
    2. emit user joined message
    3. share SDP between peers
    ...
    4. until one of peers does not leave session
    5. Discard channels,
    6. Disconnect other user
    """

    chat_groups = {}

    async def connect(self) -> None:

        """
        General flow when connecting to django chat channel:
        If any of actions listed below fail, connection is closed
            1. Validate user by their access token
            2. Get visit uuid, check if it's not None
                2.1 (Optional) Check whether uuid exists in db
            3. Add user to meeting list
            4. Check member if number hasnt exceeded max number of members
            5. Add group to channel layer
            6. Accept connection
        """

        self.user = self.scope.get("user")
        if self.user.is_anonymous:
            await self.close()
        else:
            self.visit_uuid = self.scope["url_route"]['kwargs'].get('meeting_id')
            if self.visit_uuid is None:
                await self.close()
            else:
                self.room_group_name = f"{self.visit_uuid}"
                self.chat_groups.setdefault(self.room_group_name, set())
                if self.user.email not in self.chat_groups[self.room_group_name] and \
                    len(self.chat_groups[self.room_group_name]) >= 2:
                    self.close()
                else:
                    self.chat_groups[self.room_group_name].add(self.user.email)
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )
                    await self.accept()

    async def disconnect(self, code):
        await super().disconnect(code)
        if getattr(self, "visit_uuid", False):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "bye",
                    "message": f"User {self.user.first_name} {self.user.last_name} disconnected"
                })

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        text_data_json = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": text_data_json["type"],
                "full_name": " ".join((self.user.first_name, self.user.last_name)),
                "message": text_data_json["message"]
            }
        )

    async def share_session_description_protocol(self, event):
        await self.send(text_data = json.dumps(
            {
                "type": "received.sdp",
                "sdp": event["message"],
                "name": event["full_name"],
            })
        )
    
    async def bye(self, event):
        if self.user.email in self.chat_groups[self.room_group_name]:
            self.chat_groups[self.room_group_name].remove(self.user.email)
        await self.send_json({
            "type": "bye",
            "name": event["message"]
        })

    async def hello(self, event):
        print(self.chat_groups)
        await self.send_json(
            {
                "type": "hello",
                "message": event["message"],
                "name": event["full_name"],
            }
        )