// Centralized data for EmpireBD application

// Navigation menu items
export const navigationItems = ["Shoes", "Sandals", "Jackets", "Bags"];

// Hero sections data
export const heroSections = {
  shoes: {
    image:
      "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023183/2_hdu9ho.png",
    title: "Horsebit Loafer",
    description:
      "Introducing the Empire Horsebit Loafer, a timeless tribute to elegance and sophistication. Crafted with precision using genuine leather, these loafers pay homage to the iconic design that revolutionized the world of footwear in 1953.",
    buttonText: "Explore",
    textColor: "text-white",
    borderColor: "border-white",
    segment: "shoes",
  },
  men: {
    image:
      "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023181/9_f06nl9.png",
    title: "Flight Jacket",
    description:
      "Originally designed for pilots, the Flight Jacket became a fashion icon, symbolizing ruggedness and style. Its roots trace back to the early 20th century when it provided warmth and durability for aviators. Today, it combines classic appeal with a modern edge, perfect for everyday ...",
    buttonText: "Explore",
    textColor: "text-white",
    borderColor: "border-white",
    segment: "men",
  },
  summerBags: {
    image:
      "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023178/1_svpzis.png",
    title: "Fanny pack",
    description:
      "Experience the perfect fusion of style and practicality with Wardrobe by Duke leather fanny pack. DFanny packesigned for daily use, this sleek accessory keeps your essentials within reach while enhancing any outfit. Featuring a top-tier YKK brass zipper, it ensures both reliability...",
    buttonText: "EXPLORE",
    textColor: "text-white",
    borderColor: "border-white",
    segment: "summer-bags",
  },
  sandals: {
    image:
      "https://res.cloudinary.com/dfajluzjy/image/upload/v1756119217/Untitled_design_8_juqmue.png",
    title: "Boston Clogs",
    description:
      "Proudly crafting Bangladesh's first and only clogs with genuine leather.",
    buttonText: "EXPLORE",
    textColor: "text-white",
    borderColor: "border-white",
    segment: "sandals",
  },
};

// Featured grid data
export const featuredGrids = {
  shoes: [
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023840/Untitled_design_wu3i6z.png",
      title: "Classic Penny Loafer (Two Tone)",
      subtitle:
        "Since its inception in 1936, the penny loafer has transcended trends and subcultures, earning its place as a timeless staple in every wardrobe.",
      button: "EXPLORE",
    },
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025462/Untitled_design_1_xflzlk.png",
      title: "Hi-Shine Tassel",
      subtitle:
        "A bold reinterpretation of a classic silhouette that commands attention with its distinctive charm. Crafted with meticulous attention to detail, these loafers boast a chunkier design, setting them apart from traditional tassel loafers.",
      button: "EXPLORE",
    },
  ],
  men: [
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025462/Untitled_design_2_xhzate.png",
      title: "Brown",
      subtitle: "",
      button: "EXPLORE",
    },
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025461/Untitled_design_3_mcpa40.png",
      title: "Black",
      subtitle: "",
      button: "EXPLORE",
    },
  ],
  summerBags: [
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025462/Untitled_design_4_qvfypa.png",
      title: "Dukes PUFFIN Dopp Kit",
      subtitle:
        "Designed for both travel and daily organization, PUFFIN combines durability with refined elegance.",
      button: "EXPLORE",
    },
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025461/Untitled_design_5_us76ys.png",
      title: "Dukes Double Section Toiletry Bag",
      subtitle:
        "Crafted from premium full-grain cow leather, the PUFFIN Leather Dopp Kit is designed for those who appreciate timeless elegance and lasting quality.",
      button: "EXPLORE",
    },
  ],
  sandals: [
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756119214/Untitled_design_6_gmsyjn.png",
      title: "Arizona BLACK",
      subtitle:
        "a timeless style from 1973 reimagined with Empire's new Arizona-inspired sandals",
      button: "EXPLORE",
    },
    {
      image:
        "https://res.cloudinary.com/dfajluzjy/image/upload/v1756119214/Untitled_design_7_jwiinc.png",
      title: "H Cut-out Strap",
      subtitle:
        "Its enduring appeal lies in its unparalleled craftsmanship, timeless design, and remarkable versatility, allowing it to seamlessly transition from casual to more refined ensembles.",
      button: "EXPLORE",
    },
  ],
};

// Social media links
export const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    },
  },
  {
    name: "X",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      path: "M4 4l16 16M20 4L4 20",
    },
  },
  {
    name: "Instagram",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        {
          type: "rect",
          props: { x: "2", y: "2", width: "20", height: "20", rx: "5" },
        },
        { type: "circle", props: { cx: "12", cy: "12", r: "5" } },
        { type: "circle", props: { cx: "17", cy: "7", r: "1.5" } },
      ],
    },
  },
  {
    name: "YouTube",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        {
          type: "rect",
          props: { x: "2", y: "6", width: "20", height: "12", rx: "3" },
        },
        {
          type: "polygon",
          props: { points: "10,9 16,12 10,15", fill: "currentColor" },
        },
      ],
    },
  },
  {
    name: "Spotify",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        { type: "circle", props: { cx: "12", cy: "12", r: "10" } },
        {
          type: "path",
          props: {
            d: "M8 15c2.5-1 5.5-1 8 0M7 12c3-1.5 7-1.5 10 0M6 9c3.5-2 8.5-2 12 0",
          },
        },
      ],
    },
  },
  {
    name: "Discord",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        { type: "circle", props: { cx: "12", cy: "12", r: "10" } },
        { type: "path", props: { d: "M16 16s-1.5-2-4-2-4 2-4 2" } },
        { type: "circle", props: { cx: "9", cy: "10", r: "1" } },
        { type: "circle", props: { cx: "15", cy: "10", r: "1" } },
      ],
    },
  },
  {
    name: "TikTok",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      path: "M9 17a4 4 0 1 1 4-4V5h3a4 4 0 0 0 4 4",
    },
  },
];

// Footer sections data
export const footerSections = {
  company: {
    title: "COMPANY",
    links: [
      "Careers",
      "Legal - Privacy",
      "Legal - Cookies",
      "Legal - General Terms and Conditions",
      "Sustainability",
    ],
  },
  services: {
    title: "SERVICES",
    links: [
      "Women",
      "Men",
      "Bags",
      "Shoes",
      "Ready to wear",
      "Accessories",
      "Gifts",
      "Made to Measure",
    ],
  },
  clientServices: {
    title: "CLIENT SERVICES",
    links: [
      "Contact Us",
      "My Account",
      "Store Locator",
      "Legal - Terms of Sale",
      "Shipping & Returns",
      "Size Guide",
      "Care Guide",
      "Gift Card",
    ],
  },
};

// Company information
export const companyInfo = {
  name: "EMPIREBD",
  logo: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756028072/1.ai_1_alxc5g.svg",
  description: "Luxury Fashion & Lifestyle Store",
  copyright: "© 2025 EmpireBD. All rights reserved.",
};
