// Mock data for Eka products and collections

export const mockProducts = [
  {
    id: "1",
    name: "Emerald Silk Evening Gown",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",
    price: 2850,
    description: "Hand-crafted silk evening gown with intricate beadwork. Each piece is uniquely tailored for the discerning client.",
    category: "Evening Wear",
    tier: "A" as const
  },
  {
    id: "2", 
    name: "Golden Hour Blazer",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop",
    price: 1650,
    description: "Structured blazer in luxurious wool blend with gold threading details. Perfect for power meetings and elegant occasions.",
    category: "Outerwear",
    tier: "A" as const
  },
  {
    id: "3",
    name: "Midnight Cashmere Coat",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop", 
    description: "Ultra-soft cashmere coat with minimalist design. Available in multiple colors and custom sizing.",
    category: "Outerwear",
    tier: "B" as const
  },
  {
    id: "4",
    name: "Celestial Diamond Necklace",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop",
    description: "Exclusive jewelry piece featuring rare diamonds in a constellation pattern.",
    category: "Jewelry",
    tier: "C" as const
  },
  {
    id: "5",
    name: "Ivory Pearl Dress",
    image: "https://images.unsplash.com/photo-1566479179817-40b6ac0ac3c9?w=800&h=1000&fit=crop",
    price: 3200,
    description: "Timeless dress featuring hand-sewn pearl details and flowing silk fabric. A masterpiece of craftsmanship.",
    category: "Dresses",
    tier: "A" as const
  },
  {
    id: "6",
    name: "Sage Linen Set",
    image: "https://images.unsplash.com/photo-1583846835379-c4a0b5d82b25?w=800&h=1000&fit=crop",
    description: "Comfortable yet elegant linen co-ord set perfect for sophisticated casual wear.",
    category: "Casual",
    tier: "B" as const
  },
  {
    id: "7",
    name: "Royal Velvet Cape",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",
    description: "Dramatic velvet cape with historical inspiration. Limited edition piece.",
    category: "Statement",
    tier: "C" as const
  },
  {
    id: "8",
    name: "Crystal Beaded Top",
    image: "https://images.unsplash.com/photo-1581497774605-5409e84d1bb1?w=800&h=1000&fit=crop",
    price: 1850,
    description: "Shimmering top with hand-placed crystal beading. Perfect for special occasions.",
    category: "Tops",
    tier: "A" as const
  }
];

export const mockCollections = [
  {
    id: "1",
    name: "Ethereal Gardens",
    description: "A collection inspired by the mystical beauty of enchanted gardens, featuring flowing silhouettes and nature-inspired details.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
    productCount: 12,
    tier: "A" as const,
    season: "Spring 2024"
  },
  {
    id: "2",
    name: "Urban Sophistication",
    description: "Modern pieces for the contemporary woman who demands both style and substance in her wardrobe.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    productCount: 8,
    tier: "B" as const,
    season: "Fall 2024"
  },
  {
    id: "3",
    name: "Midnight Luxe",
    description: "Our most exclusive collection featuring rare materials and avant-garde designs for the true connoisseur.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
    productCount: 6,
    tier: "C" as const,
    season: "Limited Edition"
  },
  {
    id: "4",
    name: "Golden Hour",
    description: "Warm, luxurious pieces that capture the magic of sunset, featuring golden accents and rich textures.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    productCount: 10,
    tier: "A" as const,
    season: "Summer 2024"
  },
  {
    id: "5",
    name: "Serene Minimalism",
    description: "Clean lines and understated elegance define this collection of essential pieces for the modern wardrobe.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&h=800&fit=crop",
    productCount: 7,
    tier: "B" as const
  },
  {
    id: "6",
    name: "Royal Heritage",
    description: "Timeless pieces inspired by royal fashion throughout history, featuring exquisite craftsmanship and premium materials.",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=800&fit=crop",
    productCount: 4,
    tier: "C" as const,
    season: "Exclusive"
  }
];