import Image from "next/image";
import Reveal from "./Reveal";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  count?: number;
}

export default function Categories({ categories = [] }: { categories?: Category[] }) {

  return (
    <section id="categories" className="relative py-20 md:py-28 bg-cream-deep/60">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <Reveal className="text-center max-w-xl mx-auto">
          <div className="eyebrow justify-center inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gold" />
            Shop by Category
            <span className="h-px w-6 bg-gold" />
          </div>
          <h2 className="section-heading mt-4">Find your silhouette</h2>
          <p className="section-sub mt-4">
            Five pillars of the Gulshan Modest wardrobe — each shaped around
            comfort, coverage and quiet detail.
          </p>
        </Reveal>
 
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 5) as any}>
              <a
                href={`/shop?category=${cat.id}`}
                className="lift group block relative rounded-2xl md:rounded-[28px] overflow-hidden shadow-card aspect-[3/4]"
              >
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <span className="inline-block text-[10px] md:text-xs font-semibold tracking-widest uppercase text-gold-light/90 mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-display font-semibold text-cream text-base md:text-xl leading-tight">
                    {cat.name}
                  </h3>
                  <p className="hidden md:block text-cream/75 text-[13px] mt-1 leading-snug">
                    {cat.description}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
