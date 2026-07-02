import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailActions from './_components/ProductDetailActions'
import ProductGallery from './_components/ProductGallery'
import Products from '@/components/Products'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // Try fetching by ID first, then fallback to slug if the URL uses a slug
  let { data: productData } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_active, badge, rating, short_description, description, fabric, stitching, featured_image_url,
      product_images ( image_url ),
      product_variants ( id, variant_name, price, original_price, stock_quantity ),
      product_information ( label, value, display_order ),
      product_faqs ( question, answer, display_order )
    `)
    .eq("id", id)
    .single();

  if (!productData) {
    const { data: slugProduct } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge, rating, short_description, description, fabric, stitching, featured_image_url,
        product_images ( image_url ),
        product_variants ( id, variant_name, price, original_price, stock_quantity ),
        product_information ( label, value, display_order ),
        product_faqs ( question, answer, display_order )
      `)
      .eq("slug", id)
      .single();

    productData = slugProduct;
  }

  if (!productData || !productData.is_active) notFound();

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", productData.category_id)
    .single();

  const categoryName = category?.name || productData.category_id;

  // Compile image array
  let images: string[] = []
  if (productData.product_images && productData.product_images.length > 0) {
    images = productData.product_images.map((img: any) => img.image_url)
  } else if (productData.featured_image_url) {
    images = [productData.featured_image_url]
  }

  // Compile information
  let information = productData.product_information || []
  information.sort((a: any, b: any) => a.display_order - b.display_order)

  let faqs = productData.product_faqs || []
  faqs.sort((a: any, b: any) => a.display_order - b.display_order)

  // Filter out inactive or out-of-stock variants if we want to be strict, 
  // but let's just pass them down and disable out-of-stock ones
  const variants = productData.product_variants || []

  // Fetch similar products
  const { data: similarProductsData } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_active, badge, rating, featured_image_url,
      product_images ( image_url ),
      product_variants ( price, original_price )
    `)
    .eq("is_active", true)
    .eq("category_id", productData.category_id)
    .neq("id", productData.id)
    .limit(4);

  const similarProducts = similarProductsData?.map((p: any) => ({
    id: p.id,
    name: p.name,
    category_id: p.category_id,
    image_url: p.featured_image_url || (p.product_images?.[0]?.image_url) || "/image.png",
    badge: p.badge,
    price: p.product_variants?.[0]?.price || 0,
    oldPrice: p.product_variants?.[0]?.original_price || undefined
  })) || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-ink/50 font-medium mb-8">
            <Link href="/" className="hover:text-emerald transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-emerald transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${productData.category_id}`} className="hover:text-emerald transition-colors capitalize">
              {categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold truncate max-w-[200px]">{productData.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Product Image Gallery */}
            <ProductGallery images={images} productName={productData.name} badge={productData.badge} />

            {/* Right: Product Details & Purchase Form */}
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold font-bold">
                  {categoryName}
                </span>
                <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink mt-2 leading-tight">
                  {productData.name}
                </h1>
                
                {productData.rating && (
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-ink/60">
                    <div className="flex text-gold">★★★★★</div>
                    <span className="font-semibold text-ink">{productData.rating} ★</span>
                    <span className="text-ink/30">|</span>
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Purchase Actions client-side wrapper (includes dynamic price and Add to cart) */}
              <ProductDetailActions 
                product={{
                  id: productData.id,
                  name: productData.name,
                  image_url: images[0] || "/image.png",
                  category_name: categoryName,
                  variants: variants
                }}
              />

              {productData.short_description && (
                <div className="font-body text-ink/80 text-lg leading-relaxed pt-2">
                  <p>{productData.short_description}</p>
                </div>
              )}

              {/* Dynamic Information Section */}
              {information.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cream-line/50">
                  {information.map((info: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-cream-line shadow-sm">
                      <p className="text-[11px] font-bold text-ink/50 uppercase tracking-wider">{info.label}</p>
                      <p className="text-sm font-semibold text-emerald mt-1">{info.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Long Description & FAQs */}
              <div className="space-y-6 pt-6 border-t border-cream-line/50">
                {productData.description && (
                  <div>
                    <h3 className="font-display font-semibold text-xl text-ink mb-4">Product Details</h3>
                    <div className="font-body text-ink/75 text-base leading-relaxed whitespace-pre-wrap">
                      {productData.description}
                    </div>
                  </div>
                )}

                {faqs.length > 0 && (
                  <div className="pt-4">
                    <h3 className="font-display font-semibold text-xl text-ink mb-4">Common Questions</h3>
                    <div className="space-y-3">
                      {faqs.map((faq: any, idx: number) => (
                        <details key={idx} className="group bg-white rounded-2xl border border-cream-line shadow-sm overflow-hidden open:bg-cream-deep/30 transition-colors">
                          <summary className="font-display font-semibold text-ink text-[15px] px-5 py-4 cursor-pointer flex justify-between items-center outline-none list-none hover:text-emerald transition-colors">
                            {faq.question}
                            <span className="text-ink/50 transition-transform group-open:rotate-180 group-open:text-emerald">
                              <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18"><polyline points="6 9 12 15 18 9"/></svg>
                            </span>
                          </summary>
                          <div className="px-5 pb-5 text-ink/70 text-sm leading-relaxed border-t border-cream-line/50 mx-5 pt-3">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-cream-line">
            <Products 
              products={similarProducts} 
              categories={[{ id: productData.category_id, name: categoryName }]} 
              title="You might also like"
              subtitle="Explore similar styles from this collection."
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
