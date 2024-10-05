import slugify from "@sindresorhus/slugify";

export const getTopic = (
  name: string,
  type: "room" | "device",
  topic: "config" | "state",
): string => {
  const slug = slugify(name, {
    separator: "_",
  });

  return `homeassistant/sensor/adax_${type}_${slug}/${topic}`;
};
