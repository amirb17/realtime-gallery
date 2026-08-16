import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    comments: i.entity({
      imageId: i.string().indexed(),
      text: i.string(),
      createdAt: i.date(),
    }),

    reactions: i.entity({
      imageId: i.string().indexed(),
      emoji: i.string(),
      userId: i.string().indexed(),
      createdAt: i.date(),
  }),

    activities: i.entity({
      imageId: i.string().indexed(),
      type: i.string(),
      emoji: i.string().optional(),
      text: i.string().optional(),
      createdAt: i.date(),
    }),
  },
});

export default schema;