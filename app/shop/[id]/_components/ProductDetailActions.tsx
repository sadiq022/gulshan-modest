'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { SITE } from '@/lib/data'
import { ShoppingBag, MessageSquare, Plus, Minus } from 'lucide-react'

export type ProductVariant = {
  id: string
  variant_name: string
  price: number
  original_price: number | null
  stock_quantity: number
}

type ProductItem = {
  id: string
  name: string
  image_url: string
  category_name?: string
  variants: ProductVariant[]
}

export default function ProductDetailActions({ product }: { product: ProductItem }) {
  const { addToCart, updateQuantity, cart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  )

  // Use the selected variant price, or fallback to 0 (which shouldn't happen)
  const currentPrice = selectedVariant ? selectedVariant.price : 0
  const currentOldPrice = selectedVariant ? selectedVariant.original_price : null

  // Find if this exact item+variant is already in cart
  const cartItemId = `${product.id}-${selectedVariant?.id || 'default'}`
  const cartItem = cart.find(item => item.cartItemId === cartItemId)
  const currentQty = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      alert("Please select a size/variant first.")
      return
    }

    if (selectedVariant && selectedVariant.stock_quantity < quantity) {
      alert("Not enough stock available for this variant.")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: currentPrice,
        image_url: product.image_url,
        category_name: product.category_name,
        variant_id: selectedVariant?.id,
        variant_name: selectedVariant?.variant_name
      })
    }
    alert(`${quantity} × ${product.name} added to cart successfully!`)
  }

  const getWhatsappLink = () => {
    const variantText = selectedVariant ? ` (Variant: ${selectedVariant.variant_name})` : ''
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
      `Hi! I'm interested in purchasing the ${product.name}${variantText} (Qty: ${quantity}). Please provide details.`
    )}`
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-3 pt-3 border-t border-cream-line/50">
        <span className="font-display font-bold text-3xl text-emerald">
          ₹{currentPrice.toLocaleString('en-IN')}
        </span>
        {currentOldPrice && (
          <span className="text-ink/40 text-lg line-through">
            ₹{currentOldPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {/* Variant Selector */}
      {product.variants.length > 0 && (
        <div className="space-y-3">
          <span className="text-sm font-semibold text-ink">Select Variant/Size:</span>
          <div className="flex flex-wrap gap-2">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock_quantity <= 0}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  selectedVariant?.id === variant.id
                    ? "border-emerald bg-emerald text-cream"
                    : "border-cream-line text-ink/70 hover:border-emerald/50 hover:bg-emerald/5"
                } ${variant.stock_quantity <= 0 ? "opacity-50 cursor-not-allowed bg-cream/50 line-through" : ""}`}
              >
                {variant.variant_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
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
            disabled={product.variants.length > 0 && !selectedVariant}
            className="w-full py-3.5 px-4 bg-emerald text-cream font-body font-semibold rounded-full shadow-card hover:bg-emerald-deep transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}
