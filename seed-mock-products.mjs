import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('[REPLACE_WITH')) {
  console.error("Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set correctly in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const mockProducts = [
  {
    name: "Velvet Zari Embroidered Pakistani Suit",
    slug: "velvet-zari-pakistani-suit",
    category_id: "abayas", // Using an existing category just to link it
    description: "A stunning deep velvet Pakistani suit featuring intricate zari gold embroidery on the neckline and hem. Includes straight pants and a matching dupatta.",
    fabric: "Premium Micro Velvet",
    stitching: "Fully Stitched, Interlocked",
    is_active: true,
    is_featured: true,
    badge: "New Arrival",
    seo_title: "Velvet Zari Embroidered Pakistani Suit | Gulshan Modest",
    seo_description: "Shop luxury velvet Pakistani suits online at Gulshan Modest."
  },
  {
    name: "Georgette Floral Handworked Suit",
    slug: "georgette-floral-handworked-suit",
    category_id: "abayas",
    description: "Breathable heavy georgette fabric adorned with delicate floral threadwork and mirror details. Perfect for festive occasions.",
    fabric: "Heavy Faux Georgette",
    stitching: "Fully Stitched with Butter Crepe Inner",
    is_active: true,
    is_featured: true,
    badge: "Trending",
    seo_title: "Georgette Floral Handworked Suit",
    seo_description: "Elegant georgette Pakistani suits with floral embroidery."
  },
  {
    name: "Organza Silk Sequin Pakistani Dress",
    slug: "organza-silk-sequin-dress",
    category_id: "abayas",
    description: "Luxury organza silk with heavy sequin work across the kameez. Comes with silk trousers and a sequinned organza dupatta.",
    fabric: "Pure Organza Silk",
    stitching: "Fully Stitched, Padded",
    is_active: true,
    is_featured: false,
    seo_title: "Organza Silk Sequin Pakistani Dress",
    seo_description: "Shop organza silk Pakistani dresses."
  }
]

async function seedProducts() {
  console.log("🌱 Starting mock products seed...")

  // Delete existing mock products to allow re-running
  const slugs = mockProducts.map(p => p.slug)
  await supabase.from('products').delete().in('slug', slugs)

  // Get categories to use a valid category_id
  const { data: categories } = await supabase.from('categories').select('id').limit(1)
  const categoryId = categories && categories.length > 0 ? categories[0].id : null

  if (!categoryId) {
    console.error("No categories found! Please ensure categories exist first.")
    process.exit(1)
  }

  for (let prod of mockProducts) {
    prod.category_id = categoryId
    const productId = crypto.randomUUID()
    prod.id = productId

    console.log(`Inserting product: ${prod.name}`)
    const { error: prodError } = await supabase.from('products').insert(prod)
    if (prodError) {
      console.error(`Failed to insert ${prod.name}:`, prodError)
      continue
    }

    // Insert variants (Sizes)
    const variants = [
      { product_id: productId, variant_name: "Small", price: 4500, stock_quantity: 10 },
      { product_id: productId, variant_name: "Medium", price: 4500, stock_quantity: 15 },
      { product_id: productId, variant_name: "Large", price: 4500, stock_quantity: 8 },
      { product_id: productId, variant_name: "Extra Large", price: 4700, stock_quantity: 5 }
    ]
    
    console.log(`  -> Inserting variants...`)
    const { error: varError } = await supabase.from('product_variants').insert(variants)
    if (varError) {
      console.error(`  Failed to insert variants:`, varError)
    }
  }

  console.log("✅ Mock products and variants seeded successfully!")
}

seedProducts()
