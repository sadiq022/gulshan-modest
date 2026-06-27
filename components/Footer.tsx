import Image from "next/image";
import { navLinks, SITE } from "@/lib/data";
import BotanicalDivider from "./BotanicalDivider";

export default function Footer() {
  return (
    <footer className="relative bg-emerald-deep pt-4">
      <BotanicalDivider tone="gold" />
      <div className="max-w-wrap mx-auto px-5 md:px-8 pb-10 pt-8">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Gulshan Modest logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="font-display font-semibold text-lg text-cream">
                Gulshan Modest
              </span>
            </div>
            <p className="text-cream/60 text-sm mt-4 max-w-xs leading-relaxed">
              Modest fashion with botanical detailing, premium fabric and
              timeless silhouettes — designed in Delhi NCR, shipped pan-India.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-cream text-sm tracking-wide uppercase">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream/65 text-sm hover:text-gold-light transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-cream text-sm tracking-wide uppercase">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/65">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-gold-light transition-colors break-all">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phoneHref}`} className="hover:text-gold-light transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/45 text-xs">
            © {new Date().getFullYear()} Gulshan Modest. All rights reserved.
          </p>
          <p className="text-cream/45 text-xs">
            Crafted with care, garden by garden.
          </p>
        </div>
      </div>
    </footer>
  );
}
