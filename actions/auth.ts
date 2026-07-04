'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type AuthResult = {
  error?: string
  success?: boolean
}

export async function login(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  if (!phone || !password) {
    return { error: 'Phone number and password are required' }
  }

  const cleanPhone = phone.replace(/\D/g, '')
  const syntheticEmail = `user${cleanPhone}@gulshanmodest.com`

  const { error } = await supabase.auth.signInWithPassword({
    email: syntheticEmail,
    password,
  })

  if (error) {
    return { error: 'Invalid phone number or password' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function register(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string // optional
  const password = formData.get('password') as string

  if (!fullName || !phone || !password) {
    return { error: 'Full name, phone, and password are required' }
  }

  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length < 10) {
    return { error: 'Please enter a valid phone number' }
  }

  const syntheticEmail = `user${cleanPhone}@gulshanmodest.com`

  // 1. Create the user using the Admin API to forcefully confirm the email 
  // and bypass rate-limiting on the free tier.
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminAuth = createAdminClient().auth.admin

  const { error: createError } = await adminAuth.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true, // Forces immediate verification!
    user_metadata: {
      full_name: fullName,
      phone: cleanPhone,
      real_email: email || '',
      role: 'customer',
    },
  })

  // If the user already exists (or other creation error), catch it
  if (createError) {
    if (createError.message.includes('already been registered')) {
      return { error: 'An account with this phone number already exists' }
    }
    return { error: createError.message }
  }

  // 2. Now that the user exists and is confirmed, sign them in with the standard client
  // to properly establish their secure cookie session in the browser.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: syntheticEmail,
    password,
  })

  if (signInError) {
    return { error: 'Account created but failed to log in automatically.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function adminLogin(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Verify this user is actually an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'You do not have admin access' }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
