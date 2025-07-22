
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { ProductCard } from "@/components/ProductCard";
import { useCategory, useCategoryProducts } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryDetails = () => {
  const { category: categoryId } = useParams();
  const { data: category, isLoading: categoryLoading } = useCategory(categoryId || '');
  const { data: products, isLoading: productsLoading } = useCategoryProducts(categoryId || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
        <EkaFooter />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <EkaHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-heading text-eka-pearl mb-4">Category Not Found</h1>
          <Link to="/products" className="text-eka-golden hover:text-eka-pearl transition-colors">
            Back to Categories
          </Link>
        </div>
        <EkaFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <Link 
          to="/products" 
          className="inline-flex items-center text-eka-champagne hover:text-eka-golden transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading text-eka-pearl mb-6">{category.name}</h1>
          <p className="text-xl text-eka-champagne max-w-3xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-6 border border-eka-jade-luxury/30">
                <Skeleton className="w-full h-48 rounded-2xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-heading text-eka-pearl mb-4">No Products Found</h3>
              <p className="text-eka-champagne">This category doesn't have any products yet.</p>
            </div>
          )}
        </div>
      </div>

      <EkaFooter />
    </div>
  );
};

export default CategoryDetails;
