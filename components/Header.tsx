"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks, SITE } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import dbData from "@/lib/db.json";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const isAdmin = user && (user.email?.includes('admin') || (typeof document !== 'undefined' && document.cookie.includes('mock-admin-logged-in=true')));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[99999] transition-all duration-300 ${
          open
            ? "bg-[#FBF7F0]"
            : scrolled
              ? "bg-cream/90 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(33,29,25,0.15)]"
              : "bg-transparent"
        }`}
      >
      {/* Top Bar (Hidden on Mobile, collapses on scroll) */}
      <div className={`hidden md:flex bg-[#F5EFE6] text-ink/75 text-[11px] tracking-wide px-8 justify-between items-center transition-all duration-300 ${
        scrolled ? "opacity-0 h-0 py-0 border-none overflow-hidden" : "h-9 border-b border-cream-line py-2"
      }`}>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Karol Bagh, Delhi NCR</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{SITE.email}</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">Follow Us:</span>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ink/75 hover:text-gold transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="max-w-wrap mx-auto px-5 md:px-8 flex items-center justify-between h-[72px] md:h-[84px]">
        <a href="#home" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo-dark.webp"
            alt="Gulshan Modest logo"
            width={64}
            height={64}
            className="h-12 w-12 md:h-16 md:w-16 object-contain"
            priority
          />
          <span className="font-display font-semibold text-lg md:text-xl tracking-tight text-ink">
            Gulshan Modest
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            if (link.label === "Collection") {
              return (
                <div key={link.href} className="relative group py-2">
                  <button className="font-body text-[15px] font-medium text-ink/80 hover:text-emerald transition-colors flex items-center gap-1">
                    {link.label}
                    <svg className="w-4 h-4 text-ink/40 group-hover:text-emerald transition-transform group-hover:rotate-180 duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white border border-cream-line rounded-2xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 py-2 z-50">
                    {dbData.categories.map((cat: any) => (
                      <a
                        key={cat.id}
                        href={`/shop?category=${cat.id}`}
                        className="block px-4 py-2 text-xs font-semibold text-ink/75 hover:bg-cream hover:text-emerald transition-colors"
                      >
                        {cat.name}
                      </a>
                    ))}
                    <a
                      href="/shop"
                      className="block px-4 py-2 text-xs font-bold text-emerald hover:bg-cream border-t border-cream-line/50 mt-1 transition-colors"
                    >
                      Shop All
                    </a>
                  </div>
                </div>
              )
            }
            return (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-[15px] font-medium text-ink/80 hover:text-emerald transition-colors relative group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1.5 h-[1.5px] w-0 bg-gold group-hover:w-full transition-all duration-300" />
              </a>
            )
          })}
        </nav>
 
        <div className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => setCartOpen(true)}
            className={`relative p-1.5 transition-colors shrink-0 ${scrolled ? 'text-emerald hover:text-gold' : 'text-gold hover:text-emerald'}`}
            title="Shopping Cart"
          >
            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald text-cream text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm animate-scale-up">
                {cartCount}
              </span>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-4 shrink-0">
              {isAdmin && (
                <a
                  href="/admin"
                  title="Admin Dashboard"
                  className="text-gold hover:text-emerald transition-colors p-1 shrink-0"
                >
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                </a>
              )}
              <a
                href="/profile"
                title="Manage Profile"
                className="text-gold hover:text-emerald transition-colors p-1 shrink-0"
              >
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            </div>
          )}
          {user ? (
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                setUser(null);
                window.location.reload();
              }}
              className="font-body text-[15px] font-medium text-ink/80 hover:text-emerald transition-colors"
            >
              Logout
            </button>
          ) : (
            <a
              href="/admin/login"
              className="font-body text-[15px] font-medium text-ink/80 hover:text-emerald transition-colors"
            >
              Login
            </a>
          )}
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-emerald text-cream font-body font-semibold text-sm tracking-wide hover:bg-emerald-deep transition-colors shadow-card"
          >
            Shop on WhatsApp
          </a>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Cart Icon trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className={`relative h-10 w-10 flex items-center justify-center text-ink shrink-0 transition-all ${
              scrolled
                ? "bg-transparent border-transparent shadow-none"
                : "bg-white/95 border border-cream-line/60 rounded-full shadow-sm hover:bg-cream"
            }`}
            title="Shopping Cart"
          >
            <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald text-cream text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`relative h-10 w-10 flex items-center justify-center text-[#211D19] shrink-0 transition-all ${
              scrolled
                ? "bg-transparent border-transparent shadow-none"
                : "bg-white/95 border border-cream-line/60 rounded-full shadow-sm hover:bg-cream"
            }`}
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg className="w-5.5 h-5.5 text-[#211D19]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5.5 h-5.5 text-[#211D19]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-[#FBF7F0] z-[9999] transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pt-8 gap-1">
          {navLinks.map((link, i) => {
            if (link.label === "Collection") {
              return (
                <div key={link.href} className="border-b border-cream-line py-3.5">
                  <button
                    onClick={() => setMobileCollectionOpen(!mobileCollectionOpen)}
                    className="w-full flex items-center justify-between font-display text-2xl font-semibold text-ink text-left"
                  >
                    <span>{link.label}</span>
                    <svg className={`w-6 h-6 text-gold transition-transform duration-200 ${mobileCollectionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {mobileCollectionOpen && (
                    <div className="pl-4 mt-3 space-y-3.5 animate-fade-in flex flex-col">
                      {dbData.categories.map((cat: any) => (
                        <a
                          key={cat.id}
                          href={`/shop?category=${cat.id}`}
                          onClick={() => setOpen(false)}
                          className="text-lg font-semibold text-ink/75 hover:text-emerald"
                        >
                          {cat.name}
                        </a>
                      ))}
                      <a
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className="text-lg font-bold text-emerald"
                      >
                        Shop All
                      </a>
                    </div>
                  )}
                </div>
              )
            }
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-semibold text-ink py-3.5 border-b border-cream-line"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </a>
            )
          })}
          {user && (
            <>
              {isAdmin && (
                <a
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl font-semibold text-gold py-3.5 border-b border-cream-line flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                </a>
              )}
              <a
                href="/profile"
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-semibold text-gold py-3.5 border-b border-cream-line flex items-center justify-between"
              >
                <span>Manage Profile</span>
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            </>
          )}
          {user ? (
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                setUser(null);
                setOpen(false);
                window.location.reload();
              }}
              className="font-display text-2xl font-semibold text-left text-ink py-3.5 border-b border-cream-line"
            >
              Logout
            </button>
          ) : (
            <a
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold text-ink py-3.5 border-b border-cream-line"
            >
              Login
            </a>
          )}
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-emerald text-cream font-body font-semibold text-base shadow-card"
          >
            Shop on WhatsApp
          </a>
          <div className="mt-8 text-sm text-ink/60 font-body">
            <p>{SITE.phone}</p>
            <p className="mt-1">{SITE.email}</p>
          </div>
        </nav>
      </div>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
