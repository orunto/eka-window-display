// Mock data for Eka products and collections

export const mockProducts = [
  {
    id: "1",
    name: "Emerald Silk Evening Gown",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",
    price: 2850,
    description: "Hand-crafted silk evening gown with intricate beadwork. Each piece is uniquely tailored for the discerning client.",
    category: "Dresses",
    collection: "Ethereal Gardens",
    tier: "A" as const
  },
  {
    id: "2", 
    name: "Golden Hour Blazer",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop",
    price: 1650,
    description: "Structured blazer in luxurious wool blend with gold threading details. Perfect for power meetings and elegant occasions.",
    category: "Tops",
    collection: "Golden Hour",
    tier: "A" as const
  },
  {
    id: "3",
    name: "Midnight Cashmere Coat",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop", 
    description: "Ultra-soft cashmere coat with minimalist design. Available in multiple colors and custom sizing.",
    category: "Bottoms",
    collection: "Midnight Luxe",
    tier: "B" as const
  },
  {
    id: "4",
    name: "Celestial Diamond Necklace",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop",
    description: "Exclusive jewelry piece featuring rare diamonds in a constellation pattern.",
    category: "Accessories",
    collection: "Royal Heritage",
    tier: "C" as const
  },
  {
    id: "5",
    name: "Ivory Pearl Dress",
    image: "https://images.unsplash.com/photo-1566479179817-40b6ac0ac3c9?w=800&h=1000&fit=crop",
    price: 3200,
    description: "Timeless dress featuring hand-sewn pearl details and flowing silk fabric. A masterpiece of craftsmanship.",
    category: "Ensembles",
    collection: "Ethereal Gardens",
    tier: "A" as const
  },
  {
    id: "6",
    name: "Sage Linen Set",
    image: "https://images.unsplash.com/photo-1583846835379-c4a0b5d82b25?w=800&h=1000&fit=crop",
    description: "Comfortable yet elegant linen co-ord set perfect for sophisticated casual wear.",
    category: "Ensembles",
    collection: "Serene Minimalism",
    tier: "B" as const
  },
  {
    id: "7",
    name: "Royal Velvet Cape",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",
    description: "Dramatic velvet cape with historical inspiration. Limited edition piece.",
    category: "Bottoms",
    collection: "Royal Heritage",
    tier: "C" as const
  },
  {
    id: "8",
    name: "Crystal Beaded Top",
    image: "https://images.unsplash.com/photo-1581497774605-5409e84d1bb1?w=800&h=1000&fit=crop",
    price: 1850,
    description: "Shimmering top with hand-placed crystal beading. Perfect for special occasions.",
    category: "Tops",
    collection: "Golden Hour",
    tier: "A" as const
  }
];

export const mockCollections = [
  {
    id: "1",
    name: "Amara Essential",
    description: "A curated capsule wardrobe of 12 timeless pieces that form the foundation of effortless elegance. Each piece seamlessly transitions from boardroom to evening soirée, embodying Eka's philosophy of luxury through simplicity.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop",
    productCount: 12,
    tier: "A" as const,
    season: "Capsule Collection 2024",
    story: "Born from our founder's vision of 'mother is supreme,' Amara Essential celebrates the modern woman who values quality over quantity. Twelve carefully chosen pieces that honor heritage while embracing contemporary sophistication."
  },
  {
    id: "2", 
    name: "Eka x Adunni Atelier",
    description: "An exclusive collaboration merging Eka's refined tailoring with Adunni Atelier's exquisite leather craftsmanship. Limited edition pieces where African luxury meets contemporary accessories design.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    productCount: 8,
    tier: "B" as const,
    season: "Collaboration 2024",
    story: "Two heritage brands unite to create something extraordinary. Each piece tells a story of cross-cultural artistry, blending our mothers' legacies into contemporary luxury."
  },
  {
    id: "3",
    name: "Nneka's Legacy",
    description: "Our most exclusive collection, featuring archival designs reimagined for the modern era. Limited to founding clients and select members, each piece carries the original vision forward.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=800&fit=crop",
    productCount: 6,
    tier: "C" as const,
    season: "Heritage Edition",
    story: "Named after our founder's inspiration, this collection preserves the essence of Eka's origins while pushing boundaries of contemporary African luxury."
  },
  {
    id: "4",
    name: "Sahel Sophistication", 
    description: "Inspired by the golden hour across the Sahel, this collection captures the warmth and richness of African landscapes in flowing silhouettes and earth-toned luxury.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
    productCount: 10,
    tier: "A" as const,
    season: "Resort 2024",
    story: "From the vast beauty of our continent's heart comes a collection that speaks to the global African diaspora, celebrating our shared heritage through contemporary design."
  },
  {
    id: "5",
    name: "Lagos Luxe",
    description: "Urban elegance meets African heritage in this collection designed for the cosmopolitan woman. Clean lines with cultural undertones define this essential wardrobe for global cities.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&h=800&fit=crop",
    productCount: 14,
    tier: "A" as const,
    season: "Urban 2024",
    story: "For the woman who moves between worlds with grace, carrying her heritage as strength while embracing global sophistication."
  },
  {
    id: "6",
    name: "Ancestral Threads",
    description: "Royal-inspired pieces that honor ancestral craftsmanship while pushing the boundaries of contemporary luxury. Each garment is a testament to timeless African artistry.",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=800&fit=crop",
    productCount: 7,
    tier: "C" as const,
    season: "Artisan Series",
    story: "Where ancient techniques meet modern vision, creating pieces that bridge generations and celebrate the continuity of African excellence."
  }
];