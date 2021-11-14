import json
from collections import defaultdict
from asgiref.sync import async_to_sync
import time
import asyncio
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

    chat_groups = dict()
    initiator = False

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

        Differentiate whether user creates or joins the room
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
                self.chat_groups.setdefault(self.room_group_name, defaultdict(dict))
                if self.user.email not in self.chat_groups[self.room_group_name]["users"] and \
                    len(self.chat_groups[self.room_group_name]["users"]) >= 2:
                    await self.close()
                else:
                    self.chat_groups[self.room_group_name]["users"][self.user.email] = f"{self.user.first_name} {self.user.last_name}"
                    if len(self.chat_groups[self.room_group_name]["users"]) == 1:
                        self.initiator = True
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )
                    print(f"CHANNEL NAME: {self.channel_name}")
                    await self.accept()

    async def disconnect(self, code):
        await super().disconnect(code)
        if getattr(self, "visit_uuid", False):
            if self.chat_groups[self.room_group_name]["users"].get(self.user.email) is not None:
                self.chat_groups[self.room_group_name]["users"].pop(self.user.email)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "bye",
                    "data": {
                        "disconnected_user": {
                            "email": self.user.email,
                            "first_name": self.user.first_name,
                            "last_name": self.user.last_name,
                        }
                    }
                })

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        text_data_json = json.loads(text_data)
        if text_data_json.pop("toGroup"):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": text_data_json.pop("type"),
                    "author": self.user.email,
                    "body": text_data_json
                }
            )
        else:
            await self.channel_layer.send(
                self.channel_name,
                {
                    "type": text_data_json.pop("type"),
                    "author": self.user.email,
                    "body": text_data_json
                }
            )
            print("Personal message, interpreted as wanted")

        

    async def created_or_joined(self, event):
        type = "create" if self.initiator else "join"
        await self.send(text_data=json.dumps(
            {
                "type": type,
            })
        )

    async def join_announced(self, event):
        if event["author"] != self.user.email:
            await self.send(text_data=json.dumps({
                "type": event["type"],
                "author": event["author"],
                })
            )


    async def offer_sdp(self, event):
        if event["author"] != self.user.email:
            await self.send(json.dumps({
                "type": event["type"],
                "author": event["author"],
                "offer": event["body"],
            }))

    async def answer_sdp(self, event):
        if event["author"] != self.user.email:
            await self.send(json.dumps({
                "type": event["type"],
                "author": event["author"],
                "answer": event["body"],
            }))
    
    async def bye(self, event):
        await self.send_json({
            "type": "bye",
            "data": event["data"]
        })

