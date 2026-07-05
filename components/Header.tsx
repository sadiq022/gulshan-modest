"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks, SITE } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import dbData from "@/lib/db.json";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const isAdmin = user && (user.email === 'admin@gulshanmodest.com' || user.user_metadata?.role === 'admin');
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
    }
  };

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
      <div className="max-w-wrap mx-auto px-5 md:px-8 flex items-center justify-between h-[72px] md:h-[84px]">
        <a href="/" className="flex items-center gap-2.5 shrink-0">
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
                  <button className="font-body text-[16px] font-semibold text-ink hover:text-emerald transition-colors flex items-center gap-1">
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
                className="font-body text-[16px] font-semibold text-ink hover:text-emerald transition-colors relative group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1.5 h-[1.5px] w-0 bg-gold group-hover:w-full transition-all duration-300" />
              </a>
            )
          })}
        </nav>
 
        <div className="hidden lg:flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative hidden xl:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-[#FBF7F0] border border-[#e6e2db] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-gold transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={() => setCartOpen(true)}
            className={`relative flex items-center justify-center h-11 w-11 rounded-full bg-gold text-white shadow-md hover:bg-emerald hover:scale-105 transition-all shrink-0`}
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
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-emerald text-cream font-body font-semibold text-sm tracking-wide hover:bg-emerald-deep transition-colors shadow-card"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-emerald text-cream font-body font-semibold text-sm tracking-wide hover:bg-emerald-deep transition-colors shadow-card"
            >
              Login/Register
            </a>
          )}
        </div>

        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Cart Icon trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className={`relative h-10 w-10 flex items-center justify-center rounded-full bg-gold text-white shadow-md hover:bg-emerald transition-all shrink-0`}
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
              className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-emerald text-cream font-body font-semibold text-base shadow-card"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-emerald text-cream font-body font-semibold text-base shadow-card"
            >
              Login/Register
            </a>
          )}
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
