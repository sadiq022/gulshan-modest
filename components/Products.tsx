"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { SITE } from "@/lib/data";
import dbData from "@/lib/db.json";
import { useCart } from "@/context/CartContext";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Products() {
  const products = dbData.products;
  const categories = dbData.categories;
  const { addToCart } = useCart();

  return (
    <section id="products" className="relative py-20 md:py-28 bg-cream">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <Reveal className="text-center max-w-xl mx-auto">
          <div className="eyebrow justify-center inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gold" />
            Featured Pieces
            <span className="h-px w-6 bg-gold" />
          </div>
          <h2 className="section-heading mt-4">This season's favourites</h2>
          <p className="section-sub mt-4">
            A curated edit from our latest drop — message us on WhatsApp for
            sizing, fabric notes or a custom order.
          </p>
        </Reveal>
 
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => {
            const categoryName = categories.find(c => c.id === p.category_id)?.name || p.category_id || "Uncategorized";
            return (
              <Reveal key={p.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="lift group bg-white rounded-2xl md:rounded-[24px] overflow-hidden shadow-card border border-cream-line/70 h-full flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 280px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-emerald text-cream text-[10px] md:text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 md:p-5 flex flex-col flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-gold font-semibold">
                      {categoryName}
                    </span>
                  <h3 className="font-display font-semibold text-ink text-[14px] md:text-base mt-1 leading-snug line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1 text-[12px] text-ink/60">
                    <span className="text-gold">★</span>
                    {p.rating}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="font-display font-bold text-emerald text-[15px] md:text-lg">
                      {formatINR(p.price)}
                    </span>
                    {p.oldPrice && (
                      <span className="text-ink/40 text-[13px] line-through">
                        {formatINR(p.oldPrice)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                        `Hi! I'm interested in the ${p.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center rounded-full border border-emerald/30 text-emerald text-[11px] font-semibold py-2 hover:bg-emerald hover:text-cream transition-colors flex items-center justify-center"
                    >
                      Enquire
                    </a>
                    <button
                      onClick={() => addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image_url: p.image_url,
                        category_name: categoryName
                      })}
                      className="w-full text-center rounded-full bg-emerald text-cream text-[11px] font-semibold py-2 hover:bg-emerald-deep transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          );
          })}
        </div>

        <Reveal className="mt-12 text-center">
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
              "Hi! I'd like to see the full Gulshan Modest catalogue."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald text-cream font-body font-semibold text-[15px] tracking-wide shadow-card hover:bg-emerald-deep transition-colors"
          >
            View Full Catalogue
          </a>
        </Reveal>
      </div>
    </section>
  );
}
