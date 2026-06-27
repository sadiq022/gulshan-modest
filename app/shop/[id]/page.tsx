import dbData from '@/lib/db.json'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailActions from './_components/ProductDetailActions'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export async function generateStaticParams() {
  return dbData.products.map((p) => ({
    id: p.id,
  }))
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = dbData.products.find((p) => p.id === params.id)
  if (!product) notFound()

  const category = dbData.categories.find((c) => c.id === product.category_id)
  const categoryName = category?.name || product.category_id

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
            <Link href={`/shop?category=${product.category_id}`} className="hover:text-emerald transition-colors capitalize">
              {categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Product Image */}
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-soft border border-gold/15 bg-cream-deep">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
                priority
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-emerald text-cream text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold font-bold">
                  {categoryName}
                </span>
                <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-ink mt-1.5 leading-tight">
                  {product.name}
                </h1>
                <div className="mt-2.5 flex items-center gap-1.5 text-sm text-ink/60">
                  <div className="flex text-gold">★★★★★</div>
                  <span className="font-semibold text-ink">{product.rating} ★</span>
                  <span className="text-ink/30">|</span>
                  <span>Verified Purchase</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3 pt-3 border-t border-cream-line/50">
                <span className="font-display font-bold text-3xl text-emerald">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.oldPrice && (
                  <span className="text-ink/40 text-lg line-through">
                    ₹{product.oldPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="space-y-3 font-body text-ink/75 text-[15px] leading-relaxed">
                <p>{product.description || `Exquisitely crafted ${product.name} in high-grade breathable fabric.`}</p>
                <p className="text-xs text-ink/50">
                  All Gulshan Modest items are stitched with absolute care, prioritizing non-see-through opacity, elegance in details, and long lasting premium finishes.
                </p>
              </div>

              {/* Purchase Actions client-side wrapper */}
              <ProductDetailActions 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url,
                  category_name: categoryName
                }}
              />

              {/* USPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-cream-line/50 pt-6">
                <div className="p-3 bg-white rounded-2xl border border-cream-line/75">
                  <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Fabric</p>
                  <p className="text-xs font-semibold text-emerald mt-0.5">{(product as any).fabric || 'Premium quality nida/crepe'}</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-line/75">
                  <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Stitching</p>
                  <p className="text-xs font-semibold text-emerald mt-0.5">{(product as any).stitching || 'Dual-reinforced seams'}</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-cream-line/75">
                  <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Shipping</p>
                  <p className="text-xs font-semibold text-emerald mt-0.5">Tracked Pan-India delivery</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
