'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ShippingActionResult = {
  error?: string
  success?: boolean
}

export async function getShippingSettings() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('settings')
    .select('shipping')
    .single()

  return data?.shipping || {
    flat_rate: 99,
    free_threshold: 1999
  }
}

export async function updateShippingSettings(
  flatRate: number,
  freeThreshold: number
): Promise<ShippingActionResult> {
  const supabase = await createClient()

  // Update shipping config inside settings table
  const { error } = await supabase
    .from('settings')
    .update({
      shipping: {
        flat_rate: flatRate,
        free_threshold: freeThreshold
      }
    })
    .eq('id', 'global-settings-id') // Or matching single settings document

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/settings/shipping')
  return { success: true }
}
