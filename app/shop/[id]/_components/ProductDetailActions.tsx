'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { SITE } from '@/lib/data'
import { ShoppingBag, MessageSquare, Plus, Minus } from 'lucide-react'

type ProductItem = {
  id: string
  name: string
  price: number
  image_url: string
  category_name?: string
}

export default function ProductDetailActions({ product }: { product: ProductItem }) {
  const { addToCart, updateQuantity, cart } = useCart()
  const [quantity, setQuantity] = useState(1)

  // Find if item is already in cart
  const cartItem = cart.find(item => item.id === product.id)
  const currentQty = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    // Add multiple quantities by calling addToCart in loop or modifying context
    // Our context addToCart adds 1 by default, let's call it
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    alert(`${quantity} × ${product.name} added to cart successfully!`)
  }

  const getWhatsappLink = () => {
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
      `Hi! I'm interested in purchasing the ${product.name} (Qty: ${quantity}). Please provide details.`
    )}`
  }

  return (
    <div className="space-y-4 pt-4 border-t border-cream-line/50">
      <div className="flex flex-wrap items-center gap-4">
        {/* Quantity control */}
        <div className="flex items-center border border-cream-line bg-white rounded-full p-1 shadow-sm">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="p-1.5 hover:text-emerald text-ink/60 transition-colors rounded-full hover:bg-cream"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-semibold text-ink text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="p-1.5 hover:text-emerald text-ink/60 transition-colors rounded-full hover:bg-cream"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Info text if in cart */}
        {currentQty > 0 && (
          <span className="text-xs font-semibold text-emerald bg-emerald/5 border border-emerald/10 px-3 py-1.5 rounded-full">
            {currentQty} currently in your cart
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <button
          onClick={handleAdd}
          className="w-full py-3.5 px-4 bg-emerald text-cream font-body font-semibold rounded-full shadow-card hover:bg-emerald-deep transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" /> Add to Cart
        </button>

        <a
          href={getWhatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 border-2 border-emerald text-emerald font-body font-semibold rounded-full hover:bg-emerald hover:text-cream transition-all duration-200 flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" /> Enquire on WhatsApp
        </a>
      </div>
    </div>
  )
}
