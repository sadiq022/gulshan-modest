import dbData from '@/lib/db.json'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopGrid from './_components/ShopGrid'

export const metadata = {
  title: 'Shop Collection | Gulshan Modest',
  description: 'Browse our complete premium collection of modest abayas, hijabs, jilbabs and khimars.',
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const products = dbData.products
  const categories = dbData.categories
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
