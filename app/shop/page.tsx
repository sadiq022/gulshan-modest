import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopGrid from './_components/ShopGrid'
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: 'Shop Collection | Gulshan Modest',
  description: 'Browse our complete premium collection of modest abayas, hijabs, jilbabs and khimars.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createClient();

  const { data: productsData } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_active, badge, rating, price, oldPrice, featured_image_url,
      product_images ( image_url ),
      product_variants ( price, original_price )
    `)
    .eq("is_active", true);

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  const products = (productsData || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category_id: p.category_id,
    image_url: p.product_images?.[0]?.image_url || p.featured_image_url || "/image.png",
    price: p.product_variants?.[0]?.price || p.price || 0,
    oldPrice: p.product_variants?.[0]?.original_price || p.oldPrice || undefined,
    badge: p.badge,
    rating: p.rating || 5,
  }));

  const categories = categoriesData || [];
  const selectedCategory = searchParams.category || ''

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="eyebrow justify-center inline-flex items-center gap-2">
              <span className="h-px w-6 bg-gold" />
              Complete Collection
              <span className="h-px w-6 bg-gold" />
            </div>
            <h1 className="section-heading mt-3">Shop the drop</h1>
            <p className="section-sub mt-2">
              Timeless silhouettes designed with maximum drape, elegance, and comfort in premium breathable fabrics.
            </p>
          </div>

          <ShopGrid 
            initialProducts={products} 
            categories={categories} 
            selectedCategory={selectedCategory} 
          />

        </div>
      </main>
      <Footer />
    </>
  )
}
