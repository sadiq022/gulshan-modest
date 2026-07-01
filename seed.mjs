import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('[REPLACE_WITH')) {
  console.error("Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set correctly in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const data = JSON.parse(fs.readFileSync('./lib/db.json', 'utf8'))

async function seed() {
  console.log("🌱 Starting database seed...")

  // 1. Create Admin User
  console.log("Creating Admin User...")
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: 'admin@gulshanmodest.com',
    password: 'adminpassword123',
    email_confirm: true
  })

  let adminId;
  if (userError) {
    if (userError.message.includes("already exists") || userError.message.includes("already registered")) {
      console.log("Admin user already exists in auth.users, skipping creation.")
      // We need to fetch the existing user to get their ID to put in profiles if not there.
      // But for simplicity, we'll assume if they exist, their profile might exist.
    } else {
      console.error("Failed to create admin user:", userError)
    }
  } else {
    adminId = userData.user.id
    console.log("Created admin user in auth.users with ID:", adminId)

    const { error: profileError } = await supabase.from('profiles').insert({
      id: adminId,
      email: 'admin@gulshanmodest.com',
      role: 'admin',
      full_name: 'Admin User',
      is_active: true
    })
    
    if (profileError) {
      console.error("Failed to create admin profile:", profileError)
    } else {
      console.log("Created admin profile!")
    }
  }

  // 2. Insert Categories
  console.log("Inserting categories...")
  const { error: catError } = await supabase.from('categories').upsert(data.categories)
  if (catError) console.error("Category Error:", catError)

  // 3. Insert Products
  console.log("Inserting products...")
  const { error: prodError } = await supabase.from('products').upsert(data.products)
  if (prodError) console.error("Product Error:", prodError)

  // 4. Insert Orders
  console.log("Inserting orders...")
  const { error: orderError } = await supabase.from('orders').upsert(data.orders)
  if (orderError) console.error("Order Error:", orderError)

  // 5. Insert Hero Slides
  console.log("Inserting hero slides...")
  const { error: slideError } = await supabase.from('hero_slides').upsert(data.hero_slides)
  if (slideError) console.error("Hero Slides Error:", slideError)

  // 6. Insert Coupons
  console.log("Inserting coupons...")
  const { error: couponError } = await supabase.from('coupons').upsert(data.coupons)
  if (couponError) console.error("Coupons Error:", couponError)

  // 7. Insert Announcements
  console.log("Inserting announcements...")
  if (data.settings && data.settings.announcements) {
    const { error: annError } = await supabase.from('announcements').upsert(data.settings.announcements)
    if (annError) console.error("Announcements Error:", annError)
  }

  console.log("✅ Database seed completed successfully!")
  console.log("-----------------------------------------")
  console.log("Admin Login Email: admin@gulshanmodest.com")
  console.log("Admin Password: adminpassword123")
  console.log("-----------------------------------------")
}

seed()
