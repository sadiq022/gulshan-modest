import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailActions from './_components/ProductDetailActions'
import ProductGallery from './_components/ProductGallery'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Try fetching by ID first, then fallback to slug if the URL uses a slug
  let { data: productData } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_active, badge, rating, description, fabric, stitching, featured_image_url,
      product_images ( image_url ),
      product_variants ( id, variant_name, price, original_price, stock_quantity ),
      product_information ( label, value, display_order )
    `)
    .eq("id", params.id)
    .single();
    
  if (!productData) {
    const { data: slugProduct } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge, rating, description, fabric, stitching, featured_image_url,
        product_images ( image_url ),
        product_variants ( id, variant_name, price, original_price, stock_quantity ),
        product_information ( label, value, display_order )
      `)
      .eq("slug", params.id)
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

  // Filter out inactive or out-of-stock variants if we want to be strict, 
  // but let's just pass them down and disable out-of-stock ones
  const variants = productData.product_variants || []

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
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold font-bold">
                  {categoryName}
                </span>
                <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-ink mt-1.5 leading-tight">
                  {productData.name}
                </h1>
                <div className="mt-2.5 flex items-center gap-1.5 text-sm text-ink/60">
                  <div className="flex text-gold">★★★★★</div>
                  <span className="font-semibold text-ink">{productData.rating || 5} ★</span>
                  <span className="text-ink/30">|</span>
                  <span>Verified Purchase</span>
                </div>
              </div>

              <div className="space-y-3 font-body text-ink/75 text-[15px] leading-relaxed">
                <p>{productData.description || `Exquisitely crafted ${productData.name} in high-grade breathable fabric.`}</p>
                <p className="text-xs text-ink/50">
                  All Gulshan Modest items are stitched with absolute care, prioritizing non-see-through opacity, elegance in details, and long lasting premium finishes.
                </p>
              </div>

              {/* Purchase Actions client-side wrapper (includes dynamic price) */}
              <ProductDetailActions 
                product={{
                  id: productData.id,
                  name: productData.name,
                  image_url: images[0] || "/image.png",
                  category_name: categoryName,
                  variants: variants
                }}
              />

              {/* Dynamic Information Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-cream-line/50 pt-6">
                {information.length > 0 ? (
                  information.map((info: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded-2xl border border-cream-line/75">
                      <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">{info.label}</p>
                      <p className="text-xs font-semibold text-emerald mt-0.5">{info.value}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-2xl border border-cream-line/75">
                      <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Fabric</p>
                      <p className="text-xs font-semibold text-emerald mt-0.5">{productData.fabric || 'Premium quality nida/crepe'}</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-cream-line/75">
                      <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Stitching</p>
                      <p className="text-xs font-semibold text-emerald mt-0.5">{productData.stitching || 'Dual-reinforced seams'}</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-cream-line/75">
                      <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Shipping</p>
                      <p className="text-xs font-semibold text-emerald mt-0.5">Tracked Pan-India delivery</p>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
