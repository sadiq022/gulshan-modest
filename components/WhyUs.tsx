import Reveal from "./Reveal";
import BotanicalDivider from "./BotanicalDivider";
import { IconFabric, IconNeedle, IconTulip, IconWing } from "./Icons";
import { usps } from "@/lib/data";

const icons = [IconFabric, IconNeedle, IconTulip, IconWing];

const cardColors = [
  {
    iconBg: "bg-[#B9893F]/15 group-hover:bg-[#B9893F]/25",
    iconColor: "text-gold-light",
    borderColor: "group-hover:border-[#B9893F]/50",
    shadowColor: "hover:shadow-[0_20px_40px_rgba(185,137,63,0.18)]"
  },
  {
    iconBg: "bg-rose-400/10 group-hover:bg-rose-400/20",
    iconColor: "text-rose-300",
    borderColor: "group-hover:border-rose-400/45",
    shadowColor: "hover:shadow-[0_20px_40px_rgba(244,63,94,0.12)]"
  },
  {
    iconBg: "bg-amber-400/10 group-hover:bg-amber-400/20",
    iconColor: "text-amber-300",
    borderColor: "group-hover:border-amber-400/45",
    shadowColor: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.12)]"
  },
  {
    iconBg: "bg-emerald-400/10 group-hover:bg-emerald-400/20",
    iconColor: "text-emerald-300",
    borderColor: "group-hover:border-emerald-400/45",
    shadowColor: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)]"
  }
];

export default function WhyUs() {
  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-[#122A1E] via-[#0E2017] to-[#0A1610] overflow-hidden">
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-emerald-soft/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 right-0 w-[360px] h-[360px] rounded-full bg-gold/5 blur-3xl" />

      <div className="max-w-wrap mx-auto px-5 md:px-8 relative">
        <Reveal className="text-center max-w-xl mx-auto">
          <div className="eyebrow justify-center inline-flex items-center gap-2 !text-cream/90">
            <span className="h-px w-6 bg-cream/40" />
            Why Gulshan Modest
            <span className="h-px w-6 bg-cream/40" />
          </div>
          <h2 className="section-heading mt-4 !text-gold-light">
            Crafted with the same care, every time.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {usps.map((item, i) => {
            const Icon = icons[i % icons.length];
            const colors = cardColors[i % cardColors.length];
            return (
              <Reveal key={item.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className={`h-full bg-cream/[0.05] border border-cream/15 rounded-2xl md:rounded-[24px] p-5 md:p-7 backdrop-blur-sm transition-all duration-300 hover:bg-cream/[0.08] hover:-translate-y-2 group ${colors.borderColor} ${colors.shadowColor}`}>
                  <div className={`h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colors.iconBg}`}>
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 transition-colors ${colors.iconColor}`} />
                  </div>
                  <h3 className="font-display font-semibold text-cream text-base md:text-lg mt-5 transition-colors group-hover:text-cream-light">
                    {item.title}
                  </h3>
                  <p className="text-cream/65 text-[13px] md:text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <div className="relative mt-12">
        <BotanicalDivider tone="gold" />
      </div>
    </section>
  );
}
