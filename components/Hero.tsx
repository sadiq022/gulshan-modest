"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SITE } from "@/lib/data";
import HeroLineArt from "./HeroLineArt";
import dbData from "@/lib/db.json";

export default function Hero() {
  // Load active hero slides from db.json or fallback
  const activeSlides = dbData.hero_slides.filter((slide: any) => slide.is_active);
  const rightImages = activeSlides.length > 0 
    ? activeSlides.map((slide: any) => slide.image_url)
    : [
        "/model-cream-hijab.png",
        "/abaya-double-layer.png",
        "/khimar-handwork.png",
        "/jilbab-blue.png",
      ];

  const [activeRightIndex, setActiveRightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRightIndex((prev) => (prev + 1) % rightImages.length);
    }, 4000); // Transition every 4 seconds
    return () => clearInterval(interval);
  }, [rightImages.length]);

  // Extract current slide texts
  const firstSlide = (activeSlides[0] || {}) as any;
  const currentSlide = (activeSlides[activeRightIndex] || {}) as any;
  const isGlobalMode = firstSlide.text_mode === 'global';

  const heroTitle = isGlobalMode 
    ? (firstSlide.title || "Modesty. Elegance. You.") 
    : (currentSlide.title || "Modesty. Elegance. You.");

  const heroSubtitle = isGlobalMode 
    ? (firstSlide.subtitle || "Premium Quality Modest Fashion for Every Occasion — crafted with botanical detailing and premium fabric.") 
    : (currentSlide.subtitle || "Premium Quality Modest Fashion for Every Occasion — crafted with botanical detailing and premium fabric.");

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-[120px] md:pt-[150px] pb-16 md:pb-24 bg-[#FCF8F2]"
    >

      {/* ambient gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-gold-pale via-gold-light/40 to-transparent blur-3xl opacity-50 z-0" />
      <div className="pointer-events-none absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-rose-soft/30 via-cream to-transparent blur-3xl opacity-55 z-0" />

      <div className="max-w-[1400px] mx-auto px-5 md:px-8 relative z-10 w-full min-h-[580px] flex items-center justify-center">
        <div className="grid lg:grid-cols-[1fr_1.8fr_1fr] gap-6 items-center w-full">
          
          {/* Left Column: Model in Black Khimar (Desktop only, framed, same height and distance from top) */}
          <div className="hidden lg:block relative w-[340px] h-[520px] mx-auto rounded-[28px] overflow-hidden shadow-soft border border-gold/15 bg-cream-deep self-start mt-6">
            <Image
              src="/khimar-handwork-1.png"
              alt="Gulshan Modest Black Khimar"
              fill
              sizes="340px"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Center Column: Logo, Brand Text, and Actions (Centered) */}
          <div className="relative z-10 flex flex-col items-center text-center px-2 py-4">
            
            {/* Monogram Logo Icon (Black boundary / transparent bg) */}
            <div className="relative w-16 h-16 -mt-6 md:mt-0 mb-4 mix-blend-multiply">
              <Image
                src="/logo.png"
                alt="Gulshan Modest Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Brand Typography */}
            <span className="font-display font-semibold text-base md:text-lg tracking-[0.25em] text-gold uppercase">
              Gulshan Modest
            </span>
            <div className="w-16 h-[1px] bg-gold/50 my-2" />

            <h1 className="mt-3 font-display font-bold leading-[1.1] text-[2.8rem] sm:text-5xl md:text-6xl text-emerald">
              {heroTitle === "Gulshan Modest" || heroTitle === "Modesty. Elegance. You." || !heroTitle ? (
                <>
                  Modesty. <br />
                  <span className="text-gold">Elegance.</span> You.
                </>
              ) : (
                heroTitle
              )}
            </h1>

            <p className="mt-5 text-base md:text-lg text-emerald/80 font-body max-w-[480px] leading-relaxed">
              {heroSubtitle}
            </p>

            {/* Mobile/Tablet Model Showcase (Just below hero text, above buttons) */}
            <div className="lg:hidden my-8 grid grid-cols-2 gap-4 w-full max-w-[360px] mx-auto">
              <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-soft border border-gold/15 bg-cream-deep">
                <Image
                  src="/khimar-handwork-1.png"
                  alt="Model"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-soft border border-gold/15 bg-cream-deep">
                {rightImages.map((src, index) => (
                  <div
                    key={src + "-mobile"}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === activeRightIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="Model"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                  SITE.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald text-cream font-body font-semibold text-[15px] tracking-wide shadow-card hover:bg-emerald-deep transition-all hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.49 4.975 1.491 5.474 0 9.932-4.457 9.935-9.931a9.885 9.885 0 0 0-2.883-7.054A9.882 9.882 0 0 0 11.758 1.15c-5.483 0-9.94 4.458-9.944 9.934-.002 1.936.507 3.82 1.476 5.489L2.247 20.89l4.4-.736z" />
                </svg>
                Shop on WhatsApp
              </a>
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-emerald text-emerald font-body font-semibold text-[15px] tracking-wide hover:bg-emerald hover:text-cream transition-all hover:scale-[1.02]"
              >
                Shop the Collection
              </a>
            </div>

            {/* Sub-Features */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-gold/20 pt-6 w-full max-w-[500px]">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">Fabric</span>
                <span className="text-xs sm:text-[13px] font-semibold text-emerald">Premium Quality</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">Designs</span>
                <span className="text-xs sm:text-[13px] font-semibold text-emerald">Elegant Cuts</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">Fit</span>
                <span className="text-xs sm:text-[13px] font-semibold text-emerald">Comfortable</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold tracking-wider text-ink/50 uppercase">Pricing</span>
                <span className="text-xs sm:text-[13px] font-semibold text-emerald">Affordable</span>
              </div>
            </div>

            {/* Happy Customers Badge */}
            <div className="mt-8 bg-cream/90 backdrop-blur-sm rounded-2xl shadow-card px-4 py-2 flex items-center gap-3 border border-cream-line">
              <span className="font-display font-bold text-emerald text-base leading-none">
                4.8★
              </span>
              <span className="text-[11px] text-ink/60 font-medium">
                2,300+ happy customers
              </span>
            </div>
          </div>

          {/* Right Column: Slideshow of High-Quality Images (Desktop only, framed, same height and distance from top) */}
          <div className="hidden lg:block relative w-[340px] h-[520px] mx-auto rounded-[28px] overflow-hidden shadow-soft border border-gold/15 bg-cream-deep self-start mt-6">
            {rightImages.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeRightIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={src}
                  alt="Gulshan Modest Collection"
                  fill
                  sizes="340px"
                  className="object-cover object-center"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Hero Line Art Animation (Small, located at bottom-right corner, desktop only) */}
      <HeroLineArt className="hidden lg:block absolute bottom-3 right-3 w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] opacity-75 z-0 pointer-events-none" />
    </section>
  );
}
