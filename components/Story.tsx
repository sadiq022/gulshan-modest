import Image from "next/image";
import Reveal from "./Reveal";
import BotanicalDivider from "./BotanicalDivider";
import { IconTulip } from "./Icons";

export default function Story() {
  return (
    <section id="story" className="relative py-20 md:py-28 bg-cream">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative max-w-[460px] mx-auto">
              <div className="relative aspect-[5/6] rounded-[32px] overflow-hidden shadow-soft">
                <Image
                  src="https://images.unsplash.com/photo-1571513800374-df1bbe650e56?auto=format&fit=crop&w=800&q=80"
                  alt="Hands holding a dried botanical bloom, echoing the Gulshan Modest motif"
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 md:-bottom-8 -left-4 md:-left-8 bg-cream rounded-2xl shadow-card px-5 py-4 max-w-[200px] border border-cream-line">
                <p className="font-display font-bold text-2xl text-emerald leading-none">
                  7+
                </p>
                <p className="text-xs text-ink/60 font-medium mt-1">
                  Years curating modest design
                </p>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2 flex flex-col items-center text-center lg:py-4">
            <Reveal>
              <div className="inline-flex items-center gap-2 eyebrow justify-center">
                <IconTulip className="w-4 h-4 text-gold" />
                Our Story
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="section-heading mt-4">
                Rooted in modesty,
                <br />
                grown with intention.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="section-sub mt-5 max-w-[520px] mx-auto">
                "Gulshan" means a garden in bloom — and that's exactly how we
                think about modest fashion: something that grows, layer by
                layer, into a look that feels entirely yours. Every Gulshan
                Modest piece begins with fabric chosen for how it drapes and
                breathes, then finished with the same botanical line-art
                detailing you see in our mark.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <p className="section-sub mt-4 max-w-[520px] mx-auto">
                We design and dispatch out of Delhi NCR, but we make for
                anyone who wants their modest wardrobe to feel considered, not
                compromised.
              </p>
            </Reveal>
            <Reveal delay={4} className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 w-full">
              <div className="flex flex-col items-center">
                <p className="font-display font-bold text-2xl text-emerald">
                  120+
                </p>
                <p className="text-xs text-ink/60 font-medium mt-0.5">
                  Styles in collection
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display font-bold text-2xl text-emerald">
                  18
                </p>
                <p className="text-xs text-ink/60 font-medium mt-0.5">
                  States we ship to
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display font-bold text-2xl text-emerald">
                  2,300+
                </p>
                <p className="text-xs text-ink/60 font-medium mt-0.5">
                  Customers dressed
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <BotanicalDivider tone="gold" />
    </section>
  );
}
