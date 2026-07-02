'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type ProductGalleryProps = {
  images: string[]
  productName: string
  badge?: string
}

export default function ProductGallery({ images, productName, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Ensure we have at least one image to display
  const displayImages = images.length > 0 ? images : ['/image.png']

  return (
    <div className="flex flex-col md:flex-row gap-4">
      
      {/* Thumbnails (Left on desktop, Bottom on mobile) */}
      {displayImages.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-auto pb-2 md:pb-0 md:pr-2 scrollbar-hide md:w-[90px] shrink-0">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-24 md:w-full md:h-[110px] shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index ? "border-emerald shadow-md" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="90px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="order-1 md:order-2 relative w-full aspect-square rounded-[32px] overflow-hidden shadow-soft border border-gold/15 bg-cream-deep">
        <Image
          src={displayImages[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover transition-opacity duration-500"
          priority
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-emerald text-cream text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

    </div>
  )
}
