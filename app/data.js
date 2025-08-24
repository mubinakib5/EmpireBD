// Centralized data for EmpireBD application

// Navigation menu items
export const navigationItems = [
 "Shoes",
 "Sandals",
 "Jackets",
 "Bags",
];

// Hero sections data
export const heroSections = {
  women: {
    image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023183/2_hdu9ho.png",
    title: "Horsebit Loafer",
    description: "Introducing the Empire Horsebit Loafer, a timeless tribute to elegance and sophistication. Crafted with precision using genuine leather, these loafers pay homage to the iconic design that revolutionized the world of footwear in 1953.",
    buttonText: "Explore",
    textColor: "text-white",
    borderColor: "border-white"
  },
  men: {
    image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023181/9_f06nl9.png",
    title: "Flight Jacket",
    description: "Originally designed for pilots, the Flight Jacket became a fashion icon, symbolizing ruggedness and style. Its roots trace back to the early 20th century when it provided warmth and durability for aviators. Today, it combines classic appeal with a modern edge, perfect for everyday ...",
    buttonText: "Explore",
    textColor: "text-white",
    borderColor: "border-white"
  },
  summerBags: {
    image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023178/1_svpzis.png",
    title: "Fanny pack",
    description: "Experience the perfect fusion of style and practicality with Wardrobe by Duke leather fanny pack. DFanny packesigned for daily use, this sleek accessory keeps your essentials within reach while enhancing any outfit. Featuring a top-tier YKK brass zipper, it ensures both reliability...",
    buttonText: "EXPLORE",
    textColor: "text-white",
    borderColor: "border-white"
  }
};

// Featured grid data
export const featuredGrids = {
  women: [
    {
      image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756023840/Untitled_design_wu3i6z.png",
      title: "Women's Sunglasses",
      subtitle: "Bold Reflections",
      button: "EXPLORE"
    },
    {
      image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025462/Untitled_design_1_xflzlk.png",
      title: "Women's Bags",
      subtitle: "Romantic Craftsmanship",
      button: "EXPLORE"
    }
  ],
  men: [
    {
      image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025462/Untitled_design_2_xhzate.png",
      title: "Men's Sunglasses",
      subtitle: "New Geometric Shapes",
      button: "EXPLORE"
    },
    {
      image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025461/Untitled_design_3_mcpa40.png",
      title: "Men's Bags",
      subtitle: "Nautical Inspiration",
      button: "EXPLORE"
    }
  ],
  summerBags: [
    {
      image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025462/Untitled_design_4_qvfypa.png",
      title: "Men's Sunglasses",
      subtitle: "New Geometric Shapes",
      button: "EXPLORE"
    },
    {
      image: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756025461/Untitled_design_5_us76ys.png",
      title: "Men's Bags",
      subtitle: "Nautical Inspiration",
      button: "EXPLORE"
    }
  ]
};

// Social media links
export const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
    }
  },
  {
    name: "X",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      path: "M4 4l16 16M20 4L4 20"
    }
  },
  {
    name: "Instagram",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        { type: "rect", props: { x: "2", y: "2", width: "20", height: "20", rx: "5" } },
        { type: "circle", props: { cx: "12", cy: "12", r: "5" } },
        { type: "circle", props: { cx: "17", cy: "7", r: "1.5" } }
      ]
    }
  },
  {
    name: "YouTube",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        { type: "rect", props: { x: "2", y: "6", width: "20", height: "12", rx: "3" } },
        { type: "polygon", props: { points: "10,9 16,12 10,15", fill: "currentColor" } }
      ]
    }
  },
  {
    name: "Spotify",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      paths: [
        { type: "circle", props: { cx: "12", cy: "12", r: "10" } },
        { type: "path", props: { d: "M8 15c2.5-1 5.5-1 8 0M7 12c3-1.5 7-1.5 10 0M6 9c3.5-2 8.5-2 12 0" } }
      ]
    }
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
        { type: "circle", props: { cx: "15", cy: "10", r: "1" } }
      ]
    }
  },
  {
    name: "TikTok",
    href: "#",
    icon: {
      viewBox: "0 0 24 24",
      path: "M9 17a4 4 0 1 1 4-4V5h3a4 4 0 0 0 4 4"
    }
  }
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
      "Sustainability"
    ]
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
      "Made to Measure"
    ]
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
      "Gift Card"
    ]
  }
};

// Company information
export const companyInfo = {
  name: "EMPIREBD",
  logo: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756028072/1.ai_1_alxc5g.svg",
  description: "Luxury Fashion & Lifestyle Store",
  copyright: "© 2025 EmpireBD. All rights reserved."
};