export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Product Title",
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
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/*",
            storeOriginalFilename: false,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Alternative text for accessibility and SEO",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional caption for the image",
            },
          ],
        },
      ],
      options: {
        layout: "grid",
        sortable: true,
      },
      validation: (Rule) => Rule.min(1).error("At least one image is required"),
      description:
        "Upload multiple images at once by selecting them in the file dialog. You can drag and drop to reorder.",
    },
    {
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: "originalPrice",
      title: "Original Price (for sales)",
      type: "number",
      description:
        "Set this if the product is on sale. This will be shown with strikethrough.",
      validation: (Rule) => Rule.min(0),
    },
    {
      name: "onSale",
      title: "On Sale",
      type: "boolean",
      description: 'Toggle to show "On Sale" badge',
      initialValue: false,
    },
    {
      name: "outOfStock",
      title: "Out of Stock",
      type: "boolean",
      description:
        "Toggle to mark product as out of stock (disables Add to Cart)",
      initialValue: false,
    },
    {
      name: "salePercentage",
      title: "Sale Percentage",
      type: "number",
      description: "Discount percentage (optional, for display purposes)",
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: "summary",
      title: "Product Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    },
    {
      name: "description",
      title: "Detailed Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full product description with rich text formatting",
    },
    {
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "size",
              title: "Size",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "inStock",
              title: "In Stock",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
      ],
    },
    {
      name: "productDetails",
      title: "Product Details",
      type: "object",
      fields: [
        {
          name: "material",
          title: "Material",
          type: "string",
        },
        {
          name: "care",
          title: "Care Instructions",
          type: "text",
          rows: 3,
        },
        {
          name: "origin",
          title: "Country of Origin",
          type: "string",
        },
        {
          name: "features",
          title: "Key Features",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    },
    {
      name: "shipping",
      title: "Shipping Information",
      type: "object",
      fields: [
        {
          name: "freeShipping",
          title: "Free Shipping",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "shippingTime",
          title: "Shipping Time",
          type: "string",
          placeholder: "e.g., 2-3 business days",
        },
        {
          name: "returnPolicy",
          title: "Return Policy",
          type: "text",
          rows: 3,
        },
      ],
    },
    {
      name: "specs",
      title: "Product Specifications",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "heroSegments",
      title: "Hero Segments",
      type: "array",
      of: [{ type: "reference", to: [{ type: "heroSegment" }] }],
      validation: (Rule) => Rule.required().min(1),
      description: "Select one or more hero segments where this product should appear",
    },
    {
      name: "navigationMenu",
      title: "Navigation Menu",
      type: "reference",
      to: [{ type: "navigationMenu" }],
      validation: (Rule) => Rule.required(),
      description: "Select the main navigation category for this product",
    },
    {
      name: "facebookCatalog",
      title: "Facebook Catalog Settings",
      type: "object",
      description: "Settings for Facebook catalog integration and ads",
      fields: [
        {
          name: "condition",
          title: "Product Condition",
          type: "string",
          options: {
            list: [
              { title: "New", value: "new" },
              { title: "Refurbished", value: "refurbished" },
              { title: "Used", value: "used" }
            ]
          },
          initialValue: "new",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "googleProductCategory",
          title: "Google Product Category",
          type: "string",
          description: "Select the most appropriate Google product category for better ad targeting",
          options: {
            list: [
              { title: "Apparel & Accessories", value: "Apparel & Accessories" },
              { title: "Apparel & Accessories > Shoes", value: "Apparel & Accessories > Shoes" },
              { title: "Apparel & Accessories > Handbags, Wallets & Cases", value: "Apparel & Accessories > Handbags, Wallets & Cases" },
              { title: "Apparel & Accessories > Jewelry", value: "Apparel & Accessories > Jewelry" },
              { title: "Apparel & Accessories > Clothing", value: "Apparel & Accessories > Clothing" },
              { title: "Apparel & Accessories > Clothing > Activewear", value: "Apparel & Accessories > Clothing > Activewear" },
              { title: "Apparel & Accessories > Clothing > Dresses", value: "Apparel & Accessories > Clothing > Dresses" },
              { title: "Apparel & Accessories > Clothing > Outerwear", value: "Apparel & Accessories > Clothing > Outerwear" },
              { title: "Apparel & Accessories > Clothing > Pants", value: "Apparel & Accessories > Clothing > Pants" },
              { title: "Apparel & Accessories > Clothing > Shirts & Tops", value: "Apparel & Accessories > Clothing > Shirts & Tops" }
            ]
          },
          initialValue: "Apparel & Accessories",
        },
        {
          name: "ageGroup",
          title: "Age Group",
          type: "string",
          options: {
            list: [
              { title: "Adult", value: "adult" },
              { title: "Kids", value: "kids" },
              { title: "Toddler", value: "toddler" },
              { title: "Infant", value: "infant" }
            ]
          },
          initialValue: "adult",
        },
        {
          name: "gender",
          title: "Gender",
          type: "string",
          options: {
            list: [
              { title: "Unisex", value: "unisex" },
              { title: "Male", value: "male" },
              { title: "Female", value: "female" }
            ]
          },
          initialValue: "unisex",
        },
        {
          name: "customLabel0",
          title: "Custom Label 0",
          type: "string",
          description: "Custom label for organizing products in Facebook ads (e.g., Season, Collection)",
          placeholder: "e.g., Summer 2024, Premium Collection",
        },
        {
          name: "customLabel1",
          title: "Custom Label 1", 
          type: "string",
          description: "Additional custom label for product organization",
          placeholder: "e.g., Best Seller, New Arrival",
        },
        {
          name: "excludeFromCatalog",
          title: "Exclude from Facebook Catalog",
          type: "boolean",
          description: "Toggle to exclude this product from Facebook catalog feeds",
          initialValue: false,
        }
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
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
        {
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      brand: "brand",
      price: "price",
      media: "images.0",
    },
    prepare(selection) {
      const { title, brand, price, media } = selection;
      return {
        title: title,
        subtitle: `${brand} - ৳ ${price}`,
        media: media,
      };
    },
  },
};
