// scripts/seedProducts.ts
import mongoose, { ObjectId } from 'mongoose';
import { Category, Product } from '../models';
import { IProduct } from '../models/product.model';
import { config } from '../config/config';
import { ICartDocument } from '../models/cart.model';
import { ICategoryDocument } from '../models/category.model';

const data = (category: any) => {
  return [
    // category: 9 accesories
    {
      name: 'Sunglasses',

      attributes: {
        frameMaterial: 'Metal',
        lensMaterial: 'Acetate',
        frameColor: 'Black',
        lensColor: 'Clear',
        frameStyle: 'Square',
      },
      categoryId: category._id,
      description:
        'Sunglasses with metal frame, acetate lens, black frame and clear lens.',
      price: 50,
      images: ['/product-images/sunglasses.jpg'],
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'Clear', code: '#FFFFFF' },
        ],

        sizes: [{ name: 'Small' }, { name: 'Medium' }, { name: 'Large' }],
      },
    },

    // Category 1: Polo Shirts - Keep existing products
    {
      categoryId: category._id,
      name: 'Classic Polo Shirt',
      price: 2000,
      discountedPrice: 1499,
      description:
        'A timeless classic polo shirt crafted from premium cotton piqué. Features a ribbed collar, two-button placket, and embroidered logo for a refined casual look.',
      attributes: {
        collarStyle: 'Ribbed Polo Collar',
        cuffStyle: 'Ribbed Cuffs',
        fabric: '100% Cotton Piqué',
        pattern: 'Solid',
        sleeve: 'Short Sleeves',
        style: 'Polo Shirt',
        fabricFinish: 'Soft Wash',
      },
      variants: {
        colors: [
          { name: 'Navy', code: '#1B365D' },
          { name: 'White', code: '#FFFFFF' },
          { name: 'Black', code: '#000000' },
        ],
        fits: [{ name: 'Regular Fit' }, { name: 'Slim Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/half-sleeve-t-shirt.webp',
        '/product-images/half-sleeve-t-shirt.webp',
      ],
    },
    {
      categoryId: category._id,
      name: 'Mandarin Collar Polo',
      price: 2100,
      description:
        'A sophisticated polo with mandarin collar and clean lines. Made from premium cotton blend fabric with a subtle texture for a refined contemporary look.',
      attributes: {
        collarStyle: 'Mandarin Collar',
        cuffStyle: 'Single-Button Cuffs',
        fabric: '95% Cotton, 5% Elastane',
        pattern: 'Solid',
        sleeve: 'Short Sleeves',
        style: 'Contemporary Polo',
        fabricFinish: 'Easy Care',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'White', code: '#FFFFFF' },
          { name: 'Olive', code: '#3C4220' },
        ],
        fits: [{ name: 'Slim Fit' }, { name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/black-shirt-2.webp',
        '/product-images/black-shirt-2.webp',
      ],
    },

    // Category 2: Tees - Create appropriate T-shirt products
    {
      categoryId: category._id,
      name: 'Printed Graphic Tee',
      price: 1600,
      discountedPrice: 1400,
      description:
        'Express yourself with this unique graphic tee. Crafted from soft cotton with a relaxed fit and vibrant print—perfect for casual outings or weekend wear.',
      attributes: {
        neckStyle: 'Crew Neck',
        fabric: '100% Cotton',
        pattern: 'Graphic Print',
        sleeve: 'Short Sleeves',
        style: 'Casual T-shirt',
        fabricFinish: 'Soft Wash',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'White', code: '#FFFFFF' },
          { name: 'Navy', code: '#355C7D' },
        ],
        fits: [{ name: 'Relaxed Fit' }, { name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/black-shirt.webp',
        '/product-images/black-shirt-2.webp',
      ],
    },
    {
      categoryId: category._id,
      name: 'Essential Crew Neck T-Shirt',
      price: 1000,
      description:
        'A versatile crew neck t-shirt in pure cotton. This everyday essential features a clean design and comfortable fit—perfect for layering or wearing on its own.',
      attributes: {
        fabric: '100% Cotton',
        pattern: 'Solid',
        style: 'Basic Tee',
        neckStyle: 'Crew Neck',
        sleeve: 'Short Sleeves',
      },
      variants: {
        colors: [
          { name: 'White', code: '#FFFFFF' },
          { name: 'Charcoal', code: '#444444' },
          { name: 'Heather Grey', code: '#B8B8B8' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: ['/product-images/half-sleeve-t-shirt.webp'],
    },
    {
      categoryId: category._id,
      name: 'V-Neck Premium Tee',
      price: 1100,
      discountedPrice: 999,
      description:
        'A luxurious v-neck t-shirt made from high-quality cotton. Features a flattering neckline and superior comfort for everyday wear with a touch of sophistication.',
      attributes: {
        fabric: '95% Cotton, 5% Elastane',
        pattern: 'Solid',
        style: 'Premium Tee',
        neckStyle: 'V-Neck',
        hemType: 'Straight Hem',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'Navy', code: '#1B365D' },
          { name: 'Burgundy', code: '#800020' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: ['/product-images/v-nect-tee.png'],
    },

    // Category 3: Trousers - Create appropriate trouser products
    {
      categoryId: category._id,
      name: 'Classic Chino Trousers',
      price: 2400,
      description:
        'Versatile chino trousers crafted from premium cotton twill. Features a comfortable straight fit, side pockets, and clean finish—perfect for both casual and smart-casual occasions.',
      attributes: {
        fabric: '100% Cotton Twill',
        pattern: 'Solid',
        style: 'Chino Trousers',
        pocketStyle: 'Side & Back Pockets',
        fit: 'Straight Fit',
        closure: 'Button & Zip Fly',
      },
      variants: {
        colors: [
          { name: 'Beige', code: '#E8D8C3' },
          { name: 'Navy', code: '#1B365D' },
          { name: 'Olive', code: '#A3B18A' },
        ],
        fits: [{ name: 'Regular Fit' }, { name: 'Slim Fit' }],
        sizes: [{ name: '30' }, { name: '32' }, { name: '34' }, { name: '36' }],
      },
      images: [
        '/product-images/classic-chino-trousers.jpeg',
        '/product-images/classic-chino-trousers.jpeg',
      ],
    },
    {
      categoryId: category._id,
      name: 'Premium Dress Trousers',
      price: 3200,
      description:
        'Elegant dress trousers tailored from premium wool blend fabric. Features a classic fit with a flat front design and refined finish—ideal for formal occasions and business attire.',
      attributes: {
        fabric: '70% Wool, 30% Polyester',
        pattern: 'Solid',
        style: 'Dress Trousers',
        pocketStyle: 'Slant Pockets',
        fit: 'Classic Fit',
        closure: 'Hook & Bar with Zip Fly',
      },
      variants: {
        colors: [
          { name: 'Charcoal', code: '#444444' },
          { name: 'Navy', code: '#1B365D' },
          { name: 'Black', code: '#000000' },
        ],
        fits: [{ name: 'Regular Fit' }, { name: 'Slim Fit' }],
        sizes: [{ name: '30' }, { name: '32' }, { name: '34' }, { name: '36' }],
      },
      images: [
        '/product-images/premium-dress-trousers.avif',
        '/product-images/premium-dress-trousers.avif',
      ],
    },
    {
      categoryId: category._id,
      name: 'Casual Stretch Trousers',
      price: 1800,
      discountedPrice: 1500,
      description:
        'Comfortable stretch trousers perfect for everyday wear. Made from cotton-blend fabric with added elastane for flexibility and ease of movement.',
      attributes: {
        fabric: '95% Cotton, 5% Elastane',
        pattern: 'Solid',
        style: 'Casual Trousers',
        pocketStyle: 'Five Pocket Design',
        fit: 'Relaxed Fit',
        closure: 'Button & Zip Fly',
      },
      variants: {
        colors: [
          { name: 'Khaki', code: '#C3B091' },
          { name: 'Grey', code: '#808080' },
          { name: 'Brown', code: '#54331A' },
        ],
        fits: [{ name: 'Regular Fit' }, { name: 'Slim Fit' }],
        sizes: [{ name: '30' }, { name: '32' }, { name: '34' }, { name: '36' }],
      },
      images: [
        '/product-images/casual-stretch-trousers.webp',
        '/product-images/casual-stretch-trousers.webp',
      ],
    },

    // Category 4: Formal shirts
    {
      categoryId: category._id,
      name: 'Classic White Formal Shirt',
      price: 2200,
      discountedPrice: 1199,
      description:
        'An essential formal white shirt made from premium cotton with a subtle sheen. Features a spread collar, French cuffs, and a slim fit design—perfect for professional settings or formal occasions.',
      attributes: {
        collarStyle: 'Spread Collar',
        cuffStyle: 'French Cuffs',
        fabric: 'Egyptian Cotton',
        pattern: 'Solid',
        sleeve: 'Long Sleeves',
        style: 'Formal Shirt',
        fabricFinish: 'Easy Iron',
        fabricWeave: 'Poplin',
      },
      variants: {
        colors: [
          { name: 'White', code: '#FFFFFF' },
          { name: 'Light Blue', code: '#E6F2F8' },
        ],
        fits: [{ name: 'Slim Fit' }, { name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/classic-white-formal-shirt.jpg',
        '/product-images/classic-white-formal-shirt.jpg',
      ],
    },
    {
      categoryId: category._id,
      name: 'Business Formal Shirt',
      price: 2000,
      description:
        'A professional formal shirt made from a comfortable cotton blend fabric. Features a classic collar and contemporary slim fit design perfect for business meetings and office wear.',
      attributes: {
        collarStyle: 'Semi-Cutaway Collar',
        cuffStyle: 'Single-Button Cuffs',
        fabric: '60% Cotton, 40% Polyester',
        pattern: 'Solid',
        sleeve: 'Long Sleeves',
        style: 'Business Formal',
        fabricFinish: 'Easy Iron',
      },
      variants: {
        colors: [
          { name: 'Light Blue', code: '#C4D8E2' },
          { name: 'White', code: '#FFFFFF' },
          { name: 'Pink', code: '#F7CED7' },
        ],
        fits: [{ name: 'Slim Fit' }, { name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/business-formal-shirt.jpg',
        '/product-images/business-formal-shirt.jpg',
      ],
    },
    {
      categoryId: category._id,
      name: 'Striped Formal Shirt',
      price: 2300,
      description:
        'An elegant striped formal shirt with refined detailing. Features a classic point collar and double cuffs—perfect for adding subtle pattern to your business or formal attire.',
      attributes: {
        collarStyle: 'Point Collar',
        cuffStyle: 'Double Cuff',
        fabric: '100% Cotton',
        pattern: 'Fine Stripes',
        sleeve: 'Long Sleeves',
        style: 'Formal Shirt',
        fabricFinish: 'Easy Iron',
      },
      variants: {
        colors: [
          { name: 'Blue Stripe', code: '#E6F2F8' },
          { name: 'Grey Stripe', code: '#D3D3D3' },
        ],
        fits: [{ name: 'Slim Fit' }, { name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/striped-formal-shirt.jpg',
        '/product-images/striped-formal-shirt.jpg',
      ],
    },

    // Category 5: Fragrances - Create new products
    {
      categoryId: category._id,
      name: 'Aqua Breeze Eau de Parfum',
      price: 3500,
      description:
        'A refreshing fragrance with notes of citrus, sea salt, and amber. This sophisticated scent offers a perfect balance of freshness and longevity for everyday elegance.',
      attributes: {
        type: 'Eau de Parfum',
        scentFamily: 'Fresh/Aquatic',
        topNotes: 'Bergamot, Lemon',
        middleNotes: 'Sea Salt, Lavender',
        baseNotes: 'Amber, Musk',
        volume: '100ml',
      },
      variants: {
        colors: [{ name: 'N/A' }],
        sizes: [{ name: '50ml' }, { name: '100ml' }],
      },
      images: ['/product-images/parfum.jpg', '/product-images/parfum.jpg'],
    },
    {
      categoryId: category._id,
      name: 'Midnight Oud Cologne',
      price: 4200,
      description:
        'An intense and distinctive fragrance blending rich oud wood with spicy notes. This bold scent creates a memorable impression with remarkable depth and sophistication.',
      attributes: {
        type: 'Eau de Parfum',
        scentFamily: 'Woody/Oriental',
        topNotes: 'Saffron, Cardamom',
        middleNotes: 'Rose, Patchouli',
        baseNotes: 'Oud Wood, Vanilla',
        volume: '100ml',
      },
      variants: {
        colors: [{ name: 'N/A' }],
        sizes: [{ name: '50ml' }, { name: '100ml' }],
      },
      images: [
        '/product-images/parfum-1.webp',
        '/product-images/parfum-1.webp',
      ],
    },
    {
      categoryId: category._id,
      name: 'Citrus Vetiver Essence',
      price: 3800,
      discountedPrice: 3200,
      description:
        'A vibrant, energizing fragrance combining zesty citrus with earthy vetiver. Perfect for the modern man seeking a versatile scent that transitions effortlessly from day to night.',
      attributes: {
        type: 'Eau de Toilette',
        scentFamily: 'Citrus/Woody',
        topNotes: 'Grapefruit, Bergamot',
        middleNotes: 'Mint, Ginger',
        baseNotes: 'Vetiver, Cedar',
        volume: '75ml',
      },
      variants: {
        colors: [{ name: 'N/A' }],
        sizes: [{ name: '75ml' }, { name: '125ml' }],
      },
      images: ['/product-images/parfum-2.jpg', '/product-images/parfum-2.jpg'],
    },

    // Category 6: Gym Wear - Create new products
    {
      categoryId: category._id,
      name: 'Performance Training T-Shirt',
      price: 1800,
      discountedPrice: 900,
      description:
        'A technical training t-shirt designed for maximum performance. Features moisture-wicking fabric, strategic ventilation, and four-way stretch for unrestricted movement during workouts.',
      attributes: {
        fabric: '88% Polyester, 12% Elastane',
        pattern: 'Solid',
        style: 'Performance Tee',
        neckStyle: 'Crew Neck',
        sleeve: 'Short Sleeves',
        features: 'Moisture-Wicking, Quick-Dry',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'Electric Blue', code: '#0047AB' },
          { name: 'Charcoal', code: '#444444' },
        ],
        fits: [{ name: 'Athletic Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: ['/product-images/young-man-training-gym.avif'],
    },
    {
      categoryId: category._id,
      name: 'Active Training Shorts',
      price: 1600,
      description:
        'Versatile athletic shorts designed for intense training sessions. Features lightweight stretch fabric, built-in liner, and secure pockets for essential items during workouts.',
      attributes: {
        fabric: '92% Polyester, 8% Spandex',
        pattern: 'Solid',
        style: 'Training Shorts',
        pocketStyle: 'Zip Side Pocket',
        length: 'Above Knee',
        features: 'Inner Liner, Drawstring Waist',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'Navy', code: '#1B365D' },
          { name: 'Grey', code: '#808080' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: ['/product-images/man-black-shorts-summer-apparel.avif'],
    },
    {
      categoryId: category._id,
      name: 'Compression Performance Leggings',
      price: 2200,
      description:
        'Technical compression leggings designed to enhance performance and recovery. Features four-way stretch fabric, strategic compression zones, and moisture management technology.',
      attributes: {
        fabric: '75% Polyester, 25% Elastane',
        pattern: 'Solid with Contrast Panels',
        style: 'Compression Leggings',
        waistStyle: 'High Waist',
        length: 'Full Length',
        features: 'Compression Fit, Hidden Pocket',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'Charcoal', code: '#444444' },
        ],
        fits: [{ name: 'Compression Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: ['/product-images/legging.jpg'],
    },

    // Category 7: Kids Collections - Create new products
    {
      categoryId: category._id,
      name: 'Kids  T-Shirt',
      price: 800,
      description:
        'Playful  t-shirt for kids made from soft, comfortable cotton. Features fun prints and a relaxed fit perfect for everyday wear and active play.',
      attributes: {
        fabric: '100% Cotton',

        style: 'Casual Tee',
        neckStyle: 'Crew Neck',
        sleeve: 'Short Sleeves',
      },
      variants: {
        colors: [
          { name: 'Blue', code: '#1E90FF' },
          { name: 'White', code: '#FFFFFF' },
          { name: 'Red', code: '#FF0000' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [
          { name: '4-5Y' },
          { name: '6-7Y' },
          { name: '8-9Y' },
          { name: '10-11Y' },
        ],
      },
      images: ['/product-images/kids-shirt.jpg'],
    },
    {
      categoryId: category._id,
      name: 'Kids Denim Jeans',
      price: 1200,
      description:
        'Durable denim jeans designed for active kids. Features adjustable waistband, reinforced knees, and soft cotton fabric for all-day comfort and play.',
      attributes: {
        fabric: '98% Cotton, 2% Elastane',
        pattern: 'Solid',
        style: 'Regular Jeans',
        waistStyle: 'Adjustable Waistband',
        length: 'Full Length',
        features: 'Reinforced Knees, Multiple Pockets',
      },
      variants: {
        colors: [
          { name: 'Medium Blue', code: '#4A7AAB' },
          { name: 'Dark Blue', code: '#1E3F66' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [
          { name: '4-5Y' },
          { name: '6-7Y' },
          { name: '8-9Y' },
          { name: '10-11Y' },
        ],
      },
      images: ['/product-images/jeans-kids-blue-color-jeans.webp'],
    },
    {
      categoryId: category._id,
      name: 'Kids Polo Shirt',
      price: 900,
      description:
        'Smart casual polo shirt for kids made from soft cotton. Perfect for school or special occasions with classic styling and comfortable fit.',
      attributes: {
        collarStyle: 'Ribbed Polo Collar',
        cuffStyle: 'Ribbed Cuffs',
        fabric: '100% Cotton Piqué',
        pattern: 'Solid',
        sleeve: 'Short Sleeves',
        style: 'Polo Shirt',
      },
      variants: {
        colors: [
          { name: 'Navy', code: '#1B365D' },
          { name: 'Red', code: '#FF0000' },
          { name: 'Light Blue', code: '#C4D8E2' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [
          { name: '4-5Y' },
          { name: '6-7Y' },
          { name: '8-9Y' },
          { name: '10-11Y' },
        ],
      },
      images: ['/product-images/kids-shirt.webp'],
    },

    // Category 8: Summer Tracksuits - Create new products
    {
      categoryId: category._id,
      name: 'Lightweight Summer Tracksuit',
      price: 3500,
      description:
        'A breathable summer tracksuit made from lightweight technical fabric. Features moisture-wicking properties and relaxed fit for comfortable warm-weather training.',
      attributes: {
        fabric: '85% Polyester, 15% Elastane',
        pattern: 'Solid with Contrast Trim',
        style: 'Performance Tracksuit',
        jacketStyle: 'Full Zip',
        pantStyle: 'Elastic Waist with Drawstring',
        features: 'Moisture-Wicking, Quick-Dry',
      },
      variants: {
        colors: [
          { name: 'Navy/White', code: '#1B365D' },
          { name: 'Black/Grey', code: '#000000' },
        ],
        fits: [{ name: 'Regular Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/grey-tracksuit.webp',
        '/product-images/grey-tracksuit.webp',
      ],
    },
    {
      categoryId: category._id,
      name: 'Athletic Summer Set',
      price: 2800,
      discountedPrice: 2400,
      description:
        'Versatile summer training set combining shorts and a technical t-shirt. Perfect for warm-weather workouts with lightweight, breathable fabric and ergonomic design.',
      attributes: {
        fabric: '92% Polyester, 8% Spandex',
        pattern: 'Solid with Logo Detail',
        style: 'Performance Set',
        shirtStyle: 'Crew Neck',
        shortStyle: 'Above Knee with Inner Liner',
        features: 'Anti-Odor, UV Protection',
      },
      variants: {
        colors: [
          { name: 'Black', code: '#000000' },
          { name: 'Grey', code: '#808080' },
          { name: 'Blue', code: '#1E90FF' },
        ],
        fits: [{ name: 'Athletic Fit' }],
        sizes: [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }],
      },
      images: [
        '/product-images/black-tracksuit.webp',
        '/product-images/black-tracksuit.webp',
      ],
    },
  ];
};

async function seed() {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options as any);
    const category = await Category.findOne({ name: 'shirts' });
    await Product.insertMany(data(category));
    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
