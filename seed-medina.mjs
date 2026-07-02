import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8').split('\n');
  envConfig.forEach(line => {
    if (line.includes('=')) {
      const [key, ...values] = line.split('=');
      const value = values.join('=').replace(/[\r\n"']/g, '').trim();
      process.env[key.trim()] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // 1. Find the Medina hijab
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%Medina%')
    .single();

  if (productError || !product) {
    console.error("Error finding product:", productError);
    process.exit(1);
  }

  const productId = product.id;
  console.log(`Found product: ${product.name} (ID: ${productId})`);

  // 2. Update Product text
  const { error: updateError } = await supabase
    .from('products')
    .update({
      short_description: "The epitome of everyday luxury. Our Medina Chiffon Hijab offers an impeccable drape, lightweight breathability, and a subtle elegant texture perfectly suited for both casual and formal wear.",
      description: "Elevate your modest wardrobe with our signature Medina Luxe Chiffon. Carefully sourced for its incredibly soft touch and micro-textured finish, this hijab resists slipping while providing a flawless, voluminous drape.\n\nDesigned for the modern woman, the Medina fabric ensures breathability throughout the day without compromising on elegance. It transitions effortlessly from a busy workday to a glamorous evening event.\n\nWhether you prefer a simple wrap or intricate styling, the generous dimensions allow for complete versatility and coverage.",
      fabric: "Premium Micro-Textured Chiffon",
      stitching: "Fine baby-hem finish"
    })
    .eq('id', productId);

  if (updateError) console.error("Error updating product:", updateError);

  // 3. Information
  await supabase.from('product_information').delete().eq('product_id', productId);
  await supabase.from('product_information').insert([
    { product_id: productId, label: "Fabric", value: "Premium Luxe Chiffon", display_order: 0 },
    { product_id: productId, label: "Opacity", value: "Semi-Sheer (Requires Undercap)", display_order: 1 },
    { product_id: productId, label: "Texture", value: "Subtle Micro-Crepe", display_order: 2 },
    { product_id: productId, label: "Dimensions", value: "180cm x 75cm", display_order: 3 },
  ]);

  // 4. FAQs
  await supabase.from('product_faqs').delete().eq('product_id', productId);
  await supabase.from('product_faqs').insert([
    { product_id: productId, question: "Does this material slip easily?", answer: "While chiffon naturally has some slip, our Medina Luxe Chiffon features a micro-texture that provides more grip than traditional smooth chiffon. We still highly recommend pairing it with a cotton undercap and hijab magnets for all-day security.", display_order: 0 },
    { product_id: productId, question: "Is this hijab fully opaque?", answer: "Chiffon is inherently a lightweight, breathable material and is considered semi-sheer. For full coverage, we advise wearing it folded or styling it over a matching undercap.", display_order: 1 },
    { product_id: productId, question: "How do I care for this fabric?", answer: "To maintain the delicate texture and prevent snagging, we recommend hand washing in cold water with mild detergent. Do not wring. Hang or lay flat to dry. If ironing is needed, use the lowest heat setting or steam lightly.", display_order: 2 },
  ]);

  // 5. Variants (Colors)
  await supabase.from('product_variants').delete().eq('product_id', productId);
  await supabase.from('product_variants').insert([
    { product_id: productId, variant_name: "Dusty Rose", price: 899, original_price: 1299, stock_quantity: 50, is_active: true },
    { product_id: productId, variant_name: "Deep Emerald", price: 899, original_price: 1299, stock_quantity: 35, is_active: true },
    { product_id: productId, variant_name: "Onyx Black", price: 899, original_price: 1299, stock_quantity: 100, is_active: true },
    { product_id: productId, variant_name: "Warm Taupe", price: 899, original_price: 1299, stock_quantity: 0, is_active: true }, // Out of stock example
  ]);

  // 6. Get 3-4 images from cloudinary from ANY other products
  const { data: allImages } = await supabase
    .from('product_images')
    .select('image_url')
    .ilike('image_url', '%res.cloudinary.com%')
    .limit(4);

  if (allImages && allImages.length > 0) {
    await supabase.from('product_images').delete().eq('product_id', productId);
    
    // Insert new images
    const newImages = allImages.map((img, idx) => ({
      product_id: productId,
      image_url: img.image_url,
      sort_order: idx
    }));
    
    await supabase.from('product_images').insert(newImages);
    
    // Also update featured image
    await supabase.from('products').update({ featured_image_url: newImages[0].image_url }).eq('id', productId);
    console.log(`Added ${newImages.length} images to product`);
  } else {
    // Try to get from products.featured_image_url
    const { data: featImages } = await supabase
      .from('products')
      .select('featured_image_url')
      .ilike('featured_image_url', '%res.cloudinary.com%')
      .limit(4);
      
    if (featImages && featImages.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      
      const uniqueImages = [...new Set(featImages.map(f => f.featured_image_url).filter(Boolean))];
      
      const newImages = uniqueImages.map((url, idx) => ({
        product_id: productId,
        image_url: url,
        sort_order: idx
      }));
      
      await supabase.from('product_images').insert(newImages);
      await supabase.from('products').update({ featured_image_url: newImages[0].image_url }).eq('id', productId);
      console.log(`Added ${newImages.length} images to product`);
    } else {
      console.log("No cloudinary images found in DB to reuse.");
    }
  }

  console.log("Successfully seeded Medina Hijab!");
}

main().catch(console.error);
