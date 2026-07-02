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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-soft border border-gold/15 bg-cream-deep">
        <Image
          src={displayImages[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 540px"
          className="object-cover transition-opacity duration-500"
          priority
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-emerald text-cream text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index ? "border-emerald shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
