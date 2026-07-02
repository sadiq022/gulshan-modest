import Image from "next/image";
import { navLinks, SITE } from "@/lib/data";
import BotanicalDivider from "./BotanicalDivider";

export default function Footer() {
  return (
    <footer className="relative bg-emerald-deep pt-4">
      <BotanicalDivider tone="gold" />
      <div className="max-w-wrap mx-auto px-5 md:px-8 pb-10 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo-light.webp"
                alt="Gulshan Modest logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
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

          {/* Column 2: Explore */}
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
              <li>
                <a href="/about" className="text-cream/65 text-sm hover:text-gold-light transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div>
            <h4 className="font-display font-semibold text-cream text-sm tracking-wide uppercase">
              Legal & Policies
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="/policies/privacy" className="text-cream/65 text-sm hover:text-gold-light transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/policies/terms" className="text-cream/65 text-sm hover:text-gold-light transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/policies/refund" className="text-cream/65 text-sm hover:text-gold-light transition-colors">
                  Refund & Cancellation
                </a>
              </li>
              <li>
                <a href="/policies/shipping" className="text-cream/65 text-sm hover:text-gold-light transition-colors">
                  Shipping & Delivery
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
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
