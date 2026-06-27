'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const fullName = formData.get('full_name')?.toString()
  const phone = formData.get('phone')?.toString()

  if (!fullName) {
    return { success: false, error: 'Full Name is required' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      phone: phone || null,
    })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/account')
  revalidatePath('/account/addresses')
  
  return { success: true }
}
