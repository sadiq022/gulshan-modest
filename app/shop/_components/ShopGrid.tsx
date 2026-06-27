'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingBag, ArrowRight } from 'lucide-react'

type Product = {
  id: string
  name: string
  price: number
  oldPrice?: number
  image_url: string
  category_id: string
  badge?: string
  rating: number
  is_active: boolean
}

type Category = {
  id: string
  name: string
}

type ShopGridProps = {
  initialProducts: Product[]
  categories: Category[]
  selectedCategory: string
}

export default function ShopGrid({ initialProducts, categories, selectedCategory }: ShopGridProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    setActiveCategory(selectedCategory)
  }, [selectedCategory])

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id)
    if (id) {
      router.push(`/shop?category=${id}`)
    } else {
      router.push('/shop')
    }
  }

  // Filter products by category
  const filteredProducts = activeCategory
    ? initialProducts.filter(p => p.category_id === activeCategory && p.is_active !== false)
    : initialProducts.filter(p => p.is_active !== false)

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pb-2">
        <button
          onClick={() => handleCategorySelect('')}
          className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            activeCategory === ''
              ? 'bg-emerald text-cream shadow-md'
              : 'bg-white border border-cream-line text-ink/70 hover:border-emerald'
          }`}
        >
          All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-emerald text-cream shadow-md'
                : 'bg-white border border-cream-line text-ink/70 hover:border-emerald'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-ink/50 bg-white rounded-3xl border border-cream-line shadow-sm">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((p) => {
            const catName = categories.find(c => c.id === p.category_id)?.name || p.category_id
            return (
              <div key={p.id} className="lift group bg-white rounded-2xl md:rounded-[24px] overflow-hidden shadow-card border border-cream-line/70 flex flex-col">
                <Link href={`/shop/${p.id}`} className="relative aspect-[4/5] overflow-hidden block">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-emerald text-cream text-[10px] md:text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </Link>

                <div className="p-3.5 md:p-5 flex flex-col flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-bold">
                    {catName}
                  </span>
                  <Link href={`/shop/${p.id}`} className="hover:text-emerald transition-colors">
                    <h3 className="font-display font-semibold text-ink text-sm md:text-base mt-1 leading-snug line-clamp-2">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="font-display font-bold text-emerald text-sm md:text-base">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.oldPrice && (
                      <span className="text-ink/40 text-xs line-through">
                        ₹{p.oldPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 pt-2 border-t border-cream-line/50">
                    <button
                      onClick={() => addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image_url: p.image_url,
                        category_name: catName
                      })}
                      className="w-full text-center rounded-full bg-emerald text-cream text-xs font-semibold py-2 hover:bg-emerald-deep transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                    <Link
                      href={`/shop/${p.id}`}
                      className="w-full text-center rounded-full border border-cream-line text-ink/75 hover:border-emerald hover:text-emerald text-xs font-semibold py-2 transition-all flex items-center justify-center gap-1"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
