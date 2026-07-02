import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustMarquee from "@/components/TrustMarquee";
import Story from "@/components/Story";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import WhyUs from "@/components/WhyUs";
import BrandBanner from "@/components/BrandBanner";
import Lookbook from "@/components/Lookbook";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PakistaniEditBanner from "@/components/PakistaniEditBanner";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Fetch active hero slides
  const { data: heroSlides } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch active categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  // Fetch featured products (is_featured = true or just active)
  // For now, let's fetch active products. If is_featured exists, filter by it.
  const { data: products } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_featured, is_active,
      product_images ( image_url ),
      product_variants ( price, original_price )
    `)
    .eq("is_active", true)
    .eq("is_featured", true);

  // Format products for the frontend component
  const formattedProducts = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    category_id: p.category_id,
    image_url: p.product_images?.[0]?.image_url || p.featured_image_url || "/image.png",
    price: p.product_variants?.[0]?.price || p.price || 0,
    oldPrice: p.product_variants?.[0]?.original_price || p.oldPrice || undefined,
    badge: p.badge,
    rating: p.rating || 5,
  }));

  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero slides={heroSlides || []} />
      <TrustMarquee />
      <Categories categories={categories || []} />
      <Products products={formattedProducts} categories={categories || []} />
      <PakistaniEditBanner />
      <WhyUs />
      <BrandBanner />
      <Story />
      <Lookbook />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
