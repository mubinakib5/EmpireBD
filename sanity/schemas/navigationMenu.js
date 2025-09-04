export default {
  name: "navigationMenu",
  title: "Navigation Menu",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Menu Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The display name for this navigation menu item",
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
      description: "URL-friendly version of the title (e.g., 'shoes', 'sandals')",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional description for this menu category",
    },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this menu item should be displayed in the navigation",
    },
    {
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
      description: "Order in which this item appears in the navigation (lower numbers first)",
    },
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60),
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      isActive: "isActive",
      sortOrder: "sortOrder",
    },
    prepare(selection) {
      const { title, slug, isActive, sortOrder } = selection;
      return {
        title: title,
        subtitle: `/${slug} - Order: ${sortOrder} ${isActive ? '(Active)' : '(Inactive)'}`,
      };
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
};