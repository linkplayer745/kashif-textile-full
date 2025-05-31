import { IMAGES } from "@/constants/images";

export interface VariantOption {
  name: string;
  code?: string;
  selected?: boolean;
}

export interface DetailedProduct {
  id: string;
  categoryId: number;
  name: string;
  price: number;
  discountedPrice?: number;
  description: string;
  attributes: Record<string, string>;
  variants: {
    colors: VariantOption[];
    fits?: VariantOption[];
    sizes: VariantOption[];
  };
  images: Array<string>;
}
export const CATEGORIES = [
  {
    id: 1,
    title: "Polo Shirts",
    image: IMAGES.POLO_SHIRT,
    alt: "Man wearing a gray polo shirt",
  },
  {
    id: 2,
    title: "Tees",
    image: IMAGES.TEES,
    alt: "Man wearing a striped t-shirt",
  },
  {
    id: 3,
    title: "Trousers",
    image: IMAGES.TROUSERS,
    alt: "Close-up of khaki trousers",
  },
  {
    id: 4,
    title: "Formal shirts",
    image: IMAGES.FORMAL_SHIRT,
    alt: "Man wearing a dark formal shirt",
  },
  {
    id: 5,
    title: "Fragrances",
    image: IMAGES.FRAGANCES,
    alt: "Fragrance bottle on dark background",
  },
  {
    id: 6,
    title: "Gym Wear",
    image: IMAGES.GYM_WEAR,
    alt: "Man wearing gym attire",
  },

  {
    id: 7,
    title: "Kids Collections",
    image: IMAGES.TEES,
    alt: " Kids collection ",
  },
  {
    id: 8,
    title: "Summer Tracksuits",
    image: IMAGES.TEES,
    alt: "Man wearing a striped t-shirt",
  },
  {
    id: 9,
    title: "Accessories",
    image: IMAGES.TEES,
    alt: "Man wearing a striped t-shirt",
  },
];
export const PRODUCTS: DetailedProduct[] = [
  // category: 9 accesories
  {
    name: "Sunglasses",
    id: "2343",
    attributes: {
      frameMaterial: "Metal",
      lensMaterial: "Acetate",
      frameColor: "Black",
      lensColor: "Clear",
      frameStyle: "Square",
    },
    categoryId: 9,
    description:
      "Sunglasses with metal frame, acetate lens, black frame and clear lens.",
    price: 50,
    images: ["/product-images/sunglasses.jpg"],
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "Clear", code: "#FFFFFF", selected: false },
      ],

      sizes: [
        { name: "Small", selected: true },
        { name: "Medium", selected: false },
        { name: "Large", selected: false },
      ],
    },
  },

  // Category 1: Polo Shirts - Keep existing products
  {
    id: "5827",
    categoryId: 1,
    name: "Classic Polo Shirt",
    price: 2000,
    discountedPrice: 1499,
    description:
      "A timeless classic polo shirt crafted from premium cotton piqué. Features a ribbed collar, two-button placket, and embroidered logo for a refined casual look.",
    attributes: {
      collarStyle: "Ribbed Polo Collar",
      cuffStyle: "Ribbed Cuffs",
      fabric: "100% Cotton Piqué",
      pattern: "Solid",
      sleeve: "Short Sleeves",
      style: "Polo Shirt",
      fabricFinish: "Soft Wash",
    },
    variants: {
      colors: [
        { name: "Navy", code: "#1B365D", selected: true },
        { name: "White", code: "#FFFFFF", selected: false },
        { name: "Black", code: "#000000", selected: false },
      ],
      fits: [
        { name: "Regular Fit", selected: true },
        { name: "Slim Fit", selected: false },
      ],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/half-sleeve-t-shirt.webp",
      "/product-images/half-sleeve-t-shirt.webp",
    ],
  },
  {
    id: "6352",
    categoryId: 1,
    name: "Mandarin Collar Polo",
    price: 2100,
    description:
      "A sophisticated polo with mandarin collar and clean lines. Made from premium cotton blend fabric with a subtle texture for a refined contemporary look.",
    attributes: {
      collarStyle: "Mandarin Collar",
      cuffStyle: "Single-Button Cuffs",
      fabric: "95% Cotton, 5% Elastane",
      pattern: "Solid",
      sleeve: "Short Sleeves",
      style: "Contemporary Polo",
      fabricFinish: "Easy Care",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "White", code: "#FFFFFF", selected: false },
        { name: "Olive", code: "#3C4220", selected: false },
      ],
      fits: [
        { name: "Slim Fit", selected: true },
        { name: "Regular Fit", selected: false },
      ],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/black-shirt-2.webp",
      "/product-images/black-shirt-2.webp",
    ],
  },

  // Category 2: Tees - Create appropriate T-shirt products
  {
    id: "2154",
    categoryId: 2,
    name: "Printed Graphic Tee",
    price: 1600,
    discountedPrice: 1400,
    description:
      "Express yourself with this unique graphic tee. Crafted from soft cotton with a relaxed fit and vibrant print—perfect for casual outings or weekend wear.",
    attributes: {
      neckStyle: "Crew Neck",
      fabric: "100% Cotton",
      pattern: "Graphic Print",
      sleeve: "Short Sleeves",
      style: "Casual T-shirt",
      fabricFinish: "Soft Wash",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "White", code: "#FFFFFF", selected: false },
        { name: "Navy", code: "#355C7D", selected: false },
      ],
      fits: [
        { name: "Relaxed Fit", selected: true },
        { name: "Regular Fit", selected: false },
      ],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/black-shirt.webp",
      "/product-images/black-shirt-2.webp",
    ],
  },
  {
    id: "4720",
    categoryId: 2,
    name: "Essential Crew Neck T-Shirt",
    price: 1000,
    description:
      "A versatile crew neck t-shirt in pure cotton. This everyday essential features a clean design and comfortable fit—perfect for layering or wearing on its own.",
    attributes: {
      fabric: "100% Cotton",
      pattern: "Solid",
      style: "Basic Tee",
      neckStyle: "Crew Neck",
      sleeve: "Short Sleeves",
    },
    variants: {
      colors: [
        { name: "White", code: "#FFFFFF", selected: true },
        { name: "Charcoal", code: "#444444", selected: false },
        { name: "Heather Grey", code: "#B8B8B8", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: ["/product-images/half-sleeve-t-shirt.webp"],
  },
  {
    id: "6597",
    categoryId: 2,
    name: "V-Neck Premium Tee",
    price: 1100,
    discountedPrice: 999,
    description:
      "A luxurious v-neck t-shirt made from high-quality cotton. Features a flattering neckline and superior comfort for everyday wear with a touch of sophistication.",
    attributes: {
      fabric: "95% Cotton, 5% Elastane",
      pattern: "Solid",
      style: "Premium Tee",
      neckStyle: "V-Neck",
      hemType: "Straight Hem",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "Navy", code: "#1B365D", selected: false },
        { name: "Burgundy", code: "#800020", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: ["/product-images/v-nect-tee.png"],
  },

  // Category 3: Trousers - Create appropriate trouser products
  {
    id: "5039",
    categoryId: 3,
    name: "Classic Chino Trousers",
    price: 2400,
    description:
      "Versatile chino trousers crafted from premium cotton twill. Features a comfortable straight fit, side pockets, and clean finish—perfect for both casual and smart-casual occasions.",
    attributes: {
      fabric: "100% Cotton Twill",
      pattern: "Solid",
      style: "Chino Trousers",
      pocketStyle: "Side & Back Pockets",
      fit: "Straight Fit",
      closure: "Button & Zip Fly",
    },
    variants: {
      colors: [
        { name: "Beige", code: "#E8D8C3", selected: true },
        { name: "Navy", code: "#1B365D", selected: false },
        { name: "Olive", code: "#A3B18A", selected: false },
      ],
      fits: [
        { name: "Regular Fit", selected: true },
        { name: "Slim Fit", selected: false },
      ],
      sizes: [
        { name: "30", selected: false },
        { name: "32", selected: true },
        { name: "34", selected: false },
        { name: "36", selected: false },
      ],
    },
    images: [
      "/product-images/classic-chino-trousers.jpeg",
      "/product-images/classic-chino-trousers.jpeg",
    ],
  },
  {
    id: "8765",
    categoryId: 3,
    name: "Premium Dress Trousers",
    price: 3200,
    description:
      "Elegant dress trousers tailored from premium wool blend fabric. Features a classic fit with a flat front design and refined finish—ideal for formal occasions and business attire.",
    attributes: {
      fabric: "70% Wool, 30% Polyester",
      pattern: "Solid",
      style: "Dress Trousers",
      pocketStyle: "Slant Pockets",
      fit: "Classic Fit",
      closure: "Hook & Bar with Zip Fly",
    },
    variants: {
      colors: [
        { name: "Charcoal", code: "#444444", selected: true },
        { name: "Navy", code: "#1B365D", selected: false },
        { name: "Black", code: "#000000", selected: false },
      ],
      fits: [
        { name: "Regular Fit", selected: true },
        { name: "Slim Fit", selected: false },
      ],
      sizes: [
        { name: "30", selected: false },
        { name: "32", selected: true },
        { name: "34", selected: false },
        { name: "36", selected: false },
      ],
    },
    images: [
      "/product-images/premium-dress-trousers.avif",
      "/product-images/premium-dress-trousers.avif",
    ],
  },
  {
    id: "7432",
    categoryId: 3,
    name: "Casual Stretch Trousers",
    price: 1800,
    discountedPrice: 1500,
    description:
      "Comfortable stretch trousers perfect for everyday wear. Made from cotton-blend fabric with added elastane for flexibility and ease of movement.",
    attributes: {
      fabric: "95% Cotton, 5% Elastane",
      pattern: "Solid",
      style: "Casual Trousers",
      pocketStyle: "Five Pocket Design",
      fit: "Relaxed Fit",
      closure: "Button & Zip Fly",
    },
    variants: {
      colors: [
        { name: "Khaki", code: "#C3B091", selected: true },
        { name: "Grey", code: "#808080", selected: false },
        { name: "Brown", code: "#54331A", selected: false },
      ],
      fits: [
        { name: "Regular Fit", selected: true },
        { name: "Slim Fit", selected: false },
      ],
      sizes: [
        { name: "30", selected: false },
        { name: "32", selected: true },
        { name: "34", selected: false },
        { name: "36", selected: false },
      ],
    },
    images: [
      "/product-images/casual-stretch-trousers.webp",
      "/product-images/casual-stretch-trousers.webp",
    ],
  },

  // Category 4: Formal shirts
  {
    id: "9104",
    categoryId: 4,
    name: "Classic White Formal Shirt",
    price: 2200,
    discountedPrice: 1199,
    description:
      "An essential formal white shirt made from premium cotton with a subtle sheen. Features a spread collar, French cuffs, and a slim fit design—perfect for professional settings or formal occasions.",
    attributes: {
      collarStyle: "Spread Collar",
      cuffStyle: "French Cuffs",
      fabric: "Egyptian Cotton",
      pattern: "Solid",
      sleeve: "Long Sleeves",
      style: "Formal Shirt",
      fabricFinish: "Easy Iron",
      fabricWeave: "Poplin",
    },
    variants: {
      colors: [
        { name: "White", code: "#FFFFFF", selected: true },
        { name: "Light Blue", code: "#E6F2F8", selected: false },
      ],
      fits: [
        { name: "Slim Fit", selected: true },
        { name: "Regular Fit", selected: false },
      ],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/classic-white-formal-shirt.jpg",
      "/product-images/classic-white-formal-shirt.jpg",
    ],
  },
  {
    id: "2948",
    categoryId: 4,
    name: "Business Formal Shirt",
    price: 2000,
    description:
      "A professional formal shirt made from a comfortable cotton blend fabric. Features a classic collar and contemporary slim fit design perfect for business meetings and office wear.",
    attributes: {
      collarStyle: "Semi-Cutaway Collar",
      cuffStyle: "Single-Button Cuffs",
      fabric: "60% Cotton, 40% Polyester",
      pattern: "Solid",
      sleeve: "Long Sleeves",
      style: "Business Formal",
      fabricFinish: "Easy Iron",
    },
    variants: {
      colors: [
        { name: "Light Blue", code: "#C4D8E2", selected: true },
        { name: "White", code: "#FFFFFF", selected: false },
        { name: "Pink", code: "#F7CED7", selected: false },
      ],
      fits: [
        { name: "Slim Fit", selected: true },
        { name: "Regular Fit", selected: false },
      ],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/business-formal-shirt.jpg",
      "/product-images/business-formal-shirt.jpg",
    ],
  },
  {
    id: "3845",
    categoryId: 4,
    name: "Striped Formal Shirt",
    price: 2300,
    description:
      "An elegant striped formal shirt with refined detailing. Features a classic point collar and double cuffs—perfect for adding subtle pattern to your business or formal attire.",
    attributes: {
      collarStyle: "Point Collar",
      cuffStyle: "Double Cuff",
      fabric: "100% Cotton",
      pattern: "Fine Stripes",
      sleeve: "Long Sleeves",
      style: "Formal Shirt",
      fabricFinish: "Easy Iron",
    },
    variants: {
      colors: [
        { name: "Blue Stripe", code: "#E6F2F8", selected: true },
        { name: "Grey Stripe", code: "#D3D3D3", selected: false },
      ],
      fits: [
        { name: "Slim Fit", selected: true },
        { name: "Regular Fit", selected: false },
      ],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/striped-formal-shirt.jpg",
      "/product-images/striped-formal-shirt.jpg",
    ],
  },

  // Category 5: Fragrances - Create new products
  {
    id: "7123",
    categoryId: 5,
    name: "Aqua Breeze Eau de Parfum",
    price: 3500,
    description:
      "A refreshing fragrance with notes of citrus, sea salt, and amber. This sophisticated scent offers a perfect balance of freshness and longevity for everyday elegance.",
    attributes: {
      type: "Eau de Parfum",
      scentFamily: "Fresh/Aquatic",
      topNotes: "Bergamot, Lemon",
      middleNotes: "Sea Salt, Lavender",
      baseNotes: "Amber, Musk",
      volume: "100ml",
    },
    variants: {
      colors: [{ name: "N/A", selected: true }],
      sizes: [
        { name: "50ml", selected: false },
        { name: "100ml", selected: true },
      ],
    },
    images: ["/product-images/parfum.jpg", "/product-images/parfum.jpg"],
  },
  {
    id: "8294",
    categoryId: 5,
    name: "Midnight Oud Cologne",
    price: 4200,
    description:
      "An intense and distinctive fragrance blending rich oud wood with spicy notes. This bold scent creates a memorable impression with remarkable depth and sophistication.",
    attributes: {
      type: "Eau de Parfum",
      scentFamily: "Woody/Oriental",
      topNotes: "Saffron, Cardamom",
      middleNotes: "Rose, Patchouli",
      baseNotes: "Oud Wood, Vanilla",
      volume: "100ml",
    },
    variants: {
      colors: [{ name: "N/A", selected: true }],
      sizes: [
        { name: "50ml", selected: false },
        { name: "100ml", selected: true },
      ],
    },
    images: ["/product-images/parfum-1.webp", "/product-images/parfum-1.webp"],
  },
  {
    id: "6517",
    categoryId: 5,
    name: "Citrus Vetiver Essence",
    price: 3800,
    discountedPrice: 3200,
    description:
      "A vibrant, energizing fragrance combining zesty citrus with earthy vetiver. Perfect for the modern man seeking a versatile scent that transitions effortlessly from day to night.",
    attributes: {
      type: "Eau de Toilette",
      scentFamily: "Citrus/Woody",
      topNotes: "Grapefruit, Bergamot",
      middleNotes: "Mint, Ginger",
      baseNotes: "Vetiver, Cedar",
      volume: "75ml",
    },
    variants: {
      colors: [{ name: "N/A", selected: true }],
      sizes: [
        { name: "75ml", selected: true },
        { name: "125ml", selected: false },
      ],
    },
    images: ["/product-images/parfum-2.jpg", "/product-images/parfum-2.jpg"],
  },

  // Category 6: Gym Wear - Create new products
  {
    id: "9371",
    categoryId: 6,
    name: "Performance Training T-Shirt",
    price: 1800,
    discountedPrice: 900,
    description:
      "A technical training t-shirt designed for maximum performance. Features moisture-wicking fabric, strategic ventilation, and four-way stretch for unrestricted movement during workouts.",
    attributes: {
      fabric: "88% Polyester, 12% Elastane",
      pattern: "Solid",
      style: "Performance Tee",
      neckStyle: "Crew Neck",
      sleeve: "Short Sleeves",
      features: "Moisture-Wicking, Quick-Dry",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "Electric Blue", code: "#0047AB", selected: false },
        { name: "Charcoal", code: "#444444", selected: false },
      ],
      fits: [{ name: "Athletic Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: ["/product-images/young-man-training-gym.avif"],
  },
  {
    id: "5684",
    categoryId: 6,
    name: "Active Training Shorts",
    price: 1600,
    description:
      "Versatile athletic shorts designed for intense training sessions. Features lightweight stretch fabric, built-in liner, and secure pockets for essential items during workouts.",
    attributes: {
      fabric: "92% Polyester, 8% Spandex",
      pattern: "Solid",
      style: "Training Shorts",
      pocketStyle: "Zip Side Pocket",
      length: "Above Knee",
      features: "Inner Liner, Drawstring Waist",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "Navy", code: "#1B365D", selected: false },
        { name: "Grey", code: "#808080", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: ["/product-images/man-black-shorts-summer-apparel.avif"],
  },
  {
    id: "4192",
    categoryId: 6,
    name: "Compression Performance Leggings",
    price: 2200,
    description:
      "Technical compression leggings designed to enhance performance and recovery. Features four-way stretch fabric, strategic compression zones, and moisture management technology.",
    attributes: {
      fabric: "75% Polyester, 25% Elastane",
      pattern: "Solid with Contrast Panels",
      style: "Compression Leggings",
      waistStyle: "High Waist",
      length: "Full Length",
      features: "Compression Fit, Hidden Pocket",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "Charcoal", code: "#444444", selected: false },
      ],
      fits: [{ name: "Compression Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: ["/product-images/legging.jpg"],
  },

  // Category 7: Kids Collections - Create new products
  {
    id: "2736",
    categoryId: 7,
    name: "Kids  T-Shirt",
    price: 800,
    description:
      "Playful  t-shirt for kids made from soft, comfortable cotton. Features fun prints and a relaxed fit perfect for everyday wear and active play.",
    attributes: {
      fabric: "100% Cotton",

      style: "Casual Tee",
      neckStyle: "Crew Neck",
      sleeve: "Short Sleeves",
    },
    variants: {
      colors: [
        { name: "Blue", code: "#1E90FF", selected: true },
        { name: "White", code: "#FFFFFF", selected: false },
        { name: "Red", code: "#FF0000", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "4-5Y", selected: false },
        { name: "6-7Y", selected: true },
        { name: "8-9Y", selected: false },
        { name: "10-11Y", selected: false },
      ],
    },
    images: ["/product-images/kids-shirt.jpg"],
  },
  {
    id: "3819",
    categoryId: 7,
    name: "Kids Denim Jeans",
    price: 1200,
    description:
      "Durable denim jeans designed for active kids. Features adjustable waistband, reinforced knees, and soft cotton fabric for all-day comfort and play.",
    attributes: {
      fabric: "98% Cotton, 2% Elastane",
      pattern: "Solid",
      style: "Regular Jeans",
      waistStyle: "Adjustable Waistband",
      length: "Full Length",
      features: "Reinforced Knees, Multiple Pockets",
    },
    variants: {
      colors: [
        { name: "Medium Blue", code: "#4A7AAB", selected: true },
        { name: "Dark Blue", code: "#1E3F66", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "4-5Y", selected: false },
        { name: "6-7Y", selected: true },
        { name: "8-9Y", selected: false },
        { name: "10-11Y", selected: false },
      ],
    },
    images: ["/product-images/jeans-kids-blue-color-jeans.webp"],
  },
  {
    id: "5942",
    categoryId: 7,
    name: "Kids Polo Shirt",
    price: 900,
    description:
      "Smart casual polo shirt for kids made from soft cotton. Perfect for school or special occasions with classic styling and comfortable fit.",
    attributes: {
      collarStyle: "Ribbed Polo Collar",
      cuffStyle: "Ribbed Cuffs",
      fabric: "100% Cotton Piqué",
      pattern: "Solid",
      sleeve: "Short Sleeves",
      style: "Polo Shirt",
    },
    variants: {
      colors: [
        { name: "Navy", code: "#1B365D", selected: true },
        { name: "Red", code: "#FF0000", selected: false },
        { name: "Light Blue", code: "#C4D8E2", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "4-5Y", selected: false },
        { name: "6-7Y", selected: true },
        { name: "8-9Y", selected: false },
        { name: "10-11Y", selected: false },
      ],
    },
    images: ["/product-images/kids-shirt.webp"],
  },

  // Category 8: Summer Tracksuits - Create new products
  {
    id: "7493",
    categoryId: 8,
    name: "Lightweight Summer Tracksuit",
    price: 3500,
    description:
      "A breathable summer tracksuit made from lightweight technical fabric. Features moisture-wicking properties and relaxed fit for comfortable warm-weather training.",
    attributes: {
      fabric: "85% Polyester, 15% Elastane",
      pattern: "Solid with Contrast Trim",
      style: "Performance Tracksuit",
      jacketStyle: "Full Zip",
      pantStyle: "Elastic Waist with Drawstring",
      features: "Moisture-Wicking, Quick-Dry",
    },
    variants: {
      colors: [
        { name: "Navy/White", code: "#1B365D", selected: true },
        { name: "Black/Grey", code: "#000000", selected: false },
      ],
      fits: [{ name: "Regular Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/grey-tracksuit.webp",
      "/product-images/grey-tracksuit.webp",
    ],
  },
  {
    id: "8651",
    categoryId: 8,
    name: "Athletic Summer Set",
    price: 2800,
    discountedPrice: 2400,
    description:
      "Versatile summer training set combining shorts and a technical t-shirt. Perfect for warm-weather workouts with lightweight, breathable fabric and ergonomic design.",
    attributes: {
      fabric: "92% Polyester, 8% Spandex",
      pattern: "Solid with Logo Detail",
      style: "Performance Set",
      shirtStyle: "Crew Neck",
      shortStyle: "Above Knee with Inner Liner",
      features: "Anti-Odor, UV Protection",
    },
    variants: {
      colors: [
        { name: "Black", code: "#000000", selected: true },
        { name: "Grey", code: "#808080", selected: false },
        { name: "Blue", code: "#1E90FF", selected: false },
      ],
      fits: [{ name: "Athletic Fit", selected: true }],
      sizes: [
        { name: "S", selected: false },
        { name: "M", selected: true },
        { name: "L", selected: false },
        { name: "XL", selected: false },
      ],
    },
    images: [
      "/product-images/black-tracksuit.webp",
      "/product-images/black-tracksuit.webp",
    ],
  },
];
