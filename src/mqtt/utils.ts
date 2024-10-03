import slugify from "@sindresorhus/slugify";

import { ContentType } from "../adax-api/content";

export type RoomType = ContentType["rooms"][0];

export const getTopic = (
  room: RoomType,
  topic: "config" | "state" | "last_reset",
): string => {
  const roomName = slugify(room.name, {
    separator: "_",
  });

  return `homeassistant/sensor/adax_room_${roomName}/${topic}`;
};
