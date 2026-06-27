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

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      <TrustMarquee />
      <Categories />
      <Products />
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
