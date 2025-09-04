import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default {
  name: "heroSegment",
  title: "Hero Segment",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    // Order rank field for drag-and-drop ordering
    orderRankField({ type: 'heroSegment' }),
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "High", value: "high" },
          { title: "Normal", value: "normal" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      initialValue: "Explore",
    },
    {
      name: "badge",
      title: "Badge",
      type: "string",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Use this to control the sequence of hero segments.",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    },
  ],
  preview: {
    select: {
      title: "title",
      priority: "priority",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, priority, media } = selection;
      return {
        title,
        subtitle: priority ? `Priority: ${priority}` : "No priority set",
        media,
      };
    },
  },
};
