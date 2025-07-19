import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { EkaHeader } from "@/components/EkaHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mockProducts } from "@/data/mockData";

const CategoryDetails = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Load fonts
    const loadFonts = () => {
      const link1 = document.createElement('link');
      link1.href = 'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap';
      link1.rel = 'stylesheet';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.href = 'https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&display=swap';
      link2.rel = 'stylesheet';
      document.head.appendChild(link2);
    };
    loadFonts();
  }, []);

  const categoryProducts = mockProducts.filter(p => 
    p.category.toLowerCase() === category?.toLowerCase()
  );

  const getCategoryDescription = () => {
    switch (category?.toLowerCase()) {
      case 'tops':
        return {
          title: 'Tops',
          description: 'Sophisticated blouses, blazers, and statement pieces designed for the modern professional.',
          philosophy: 'Our tops collection embodies the perfect balance of structure and fluidity, creating pieces that transition seamlessly from boardroom to evening soirée.'
        };
      case 'bottoms':
        return {
          title: 'Bottoms',
          description: 'Tailored trousers, elegant skirts, and contemporary silhouettes for every occasion.',
          philosophy: 'Precision tailoring meets contemporary design in our bottoms collection, where every cut and seam is crafted to enhance the natural elegance of movement.'
        };
      case 'ensembles':
        return {
          title: 'Ensembles',
          description: 'Complete coordinated sets and statement dresses that embody Afromodern elegance.',
          philosophy: 'Our ensembles represent the pinnacle of coordinated luxury, where each piece works in harmony to create a complete vision of sophisticated style.'
        };
      case 'accessories':
        return {
          title: 'Accessories',
          description: 'Luxury jewelry, handbags, and finishing touches that complete your distinctive look.',
          philosophy: 'The perfect accessories are not just additions—they are the exclamation point of personal style, carefully crafted to elevate every ensemble.'
        };
      default:
        return {
          title: category || 'Category',
          description: 'Explore our carefully curated selection of luxury fashion pieces.',
          philosophy: 'Each piece in this category represents our commitment to exceptional craftsmanship and contemporary design.'
        };
    }
  };

  const categoryInfo = getCategoryDescription();

  return (
    <div className="min-h-screen bg-background">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        {/* Category Introduction */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-heading font-normal text-obsidian-depth">
            {categoryInfo.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {categoryInfo.description}
          </p>
          
          <div className="bg-pearl-mist p-8 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-normal text-obsidian-depth mb-4">
              Our Philosophy
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {categoryInfo.philosophy}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              {categoryProducts.length} pieces available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>

          {categoryProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;