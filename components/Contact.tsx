"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { SITE } from "@/lib/data";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Gulshan Modest, my name is ${name || "—"}.\nPhone: ${
      phone || "—"
    }\nMessage: ${message || "I'd like to know more about your collection."}`;
    window.open(
      `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <section id="contact" className="relative py-20 md:py-28 bg-cream-deep/60">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <Reveal className="text-center max-w-xl mx-auto">
          <div className="eyebrow justify-center inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gold" />
            Get In Touch
            <span className="h-px w-6 bg-gold" />
          </div>
          <h2 className="section-heading mt-4">Let's find your perfect fit</h2>
          <p className="section-sub mt-4">
            Questions about sizing, fabric or a custom order? Reach out — we
            usually reply within the hour.
          </p>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-start">
          <Reveal className="grid grid-cols-2 sm:grid-cols-1 gap-4">
            <a
              href={`mailto:${SITE.email}`}
              className="lift bg-white rounded-2xl p-5 md:p-6 shadow-card border border-cream-line block"
            >
              <span className="text-[11px] uppercase tracking-wider text-gold font-semibold">
                Email
              </span>
              <p className="font-display font-semibold text-ink text-[14px] md:text-base mt-1.5 break-all">
                {SITE.email}
              </p>
            </a>
            <a
              href={`tel:${SITE.phoneHref}`}
              className="lift bg-white rounded-2xl p-5 md:p-6 shadow-card border border-cream-line block"
            >
              <span className="text-[11px] uppercase tracking-wider text-gold font-semibold">
                Call Us
              </span>
              <p className="font-display font-semibold text-ink text-[14px] md:text-base mt-1.5">
                {SITE.phone}
              </p>
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lift bg-emerald rounded-2xl p-5 md:p-6 shadow-card block"
            >
              <span className="text-[11px] uppercase tracking-wider text-gold-light font-semibold">
                WhatsApp
              </span>
              <p className="font-display font-semibold text-cream text-[14px] md:text-base mt-1.5">
                {SITE.phone}
              </p>
            </a>
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-card border border-cream-line">
              <span className="text-[11px] uppercase tracking-wider text-gold font-semibold">
                Location
              </span>
              <p className="font-display font-semibold text-ink text-[14px] md:text-base mt-1.5">
                {SITE.city}
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[28px] shadow-soft border border-cream-line p-6 md:p-9"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-ink/80">
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    placeholder="Aisha Khan"
                    className="mt-2 w-full rounded-xl border border-cream-line bg-cream/40 px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-emerald outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-ink/80">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    className="mt-2 w-full rounded-xl border border-cream-line bg-cream/40 px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-emerald outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label className="text-[13px] font-semibold text-ink/80">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us what you're looking for — size, colour, occasion..."
                  className="mt-2 w-full rounded-xl border border-cream-line bg-cream/40 px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-emerald outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald text-cream font-body font-semibold text-[15px] tracking-wide shadow-card hover:bg-emerald-deep transition-colors"
              >
                Send via WhatsApp
              </button>
              <p className="text-center text-ink/45 text-xs mt-3">
                Submitting opens WhatsApp with your message pre-filled.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
