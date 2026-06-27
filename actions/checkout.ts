'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const FREE_SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 90

// Initialize Razorpay
// We wrap this in a try-catch or check to avoid crashing if keys are missing
let razorpayInstance: any = null
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
} catch (e) {
  console.warn("Razorpay credentials missing or invalid")
}

export async function createOrder(addressId: string, paymentMethod: 'COD' | 'RAZORPAY') {
  const supabase = await createClient()

  // 1. Get user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2. Validate address
  const { data: address } = await supabase
    .from('addresses')
    .select('id')
    .eq('id', addressId)
    .eq('user_id', user.id)
    .single()

  if (!address) return { success: false, error: 'Invalid shipping address' }

  // 3. Get cart items
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      variant_id,
      product_variants (
        id,
        variant_name,
        price,
        product_id,
        products (
          id,
          name
        )
      )
    `)
    .eq('user_id', user.id)

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'Your cart is empty' }
  }

  // 4. Calculate totals securely
  let subtotal = 0
  const orderItems = []

  for (const item of cartItems) {
    const variant = item.product_variants as any
    const product = variant.products

    const price = Number(variant.price)
    const quantity = Number(item.quantity)
    const lineTotal = price * quantity

    subtotal += lineTotal

    orderItems.push({
      product_id: product.id,
      variant_id: variant.id,
      product_name: product.name,
      variant_name: variant.variant_name,
      price_at_purchase: price,
      quantity: quantity,
      line_total: lineTotal
    })
  }

  const shipping_cost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total_amount = subtotal + shipping_cost

  // Generate order number
  const order_number = `AM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

  const actualPaymentMethod = paymentMethod === 'RAZORPAY' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'

  // 5. Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      order_number,
      user_id: user.id,
      address_id: addressId,
      subtotal,
      shipping_cost,
      total_amount,
      payment_status: 'pending',
      order_status: 'pending',
      payment_method: actualPaymentMethod
    }])
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    return { success: false, error: orderError?.message || 'Failed to create order' }
  }

  // 6. Insert Order Items
  const itemsToInsert = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert)

  if (itemsError) {
    console.error('Failed to insert order items:', itemsError)
    return { success: false, error: 'Failed to create order items' }
  }

  // 7. Handle Payment Method Specific Logic
  if (paymentMethod === 'RAZORPAY') {
    if (!razorpayInstance) {
      return { success: false, error: 'Razorpay is not configured on the server.' }
    }

    try {
      // Create Razorpay Order
      // amount is in paise (multiply by 100)
      const options = {
        amount: Math.round(total_amount * 100),
        currency: 'INR',
        receipt: order.id,
        payment_capture: 1
      }
      
      const rzpOrder = await razorpayInstance.orders.create(options)

      return { 
        success: true, 
        isRazorpay: true, 
        razorpayOrderId: rzpOrder.id,
        orderId: order.id,
        orderNumber: order.order_number,
        amount: options.amount
      }
    } catch (err: any) {
      console.error('Razorpay Error:', err)
      return { success: false, error: 'Failed to initialize payment gateway.' }
    }
  }

  // If COD, clear cart and finish
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  revalidatePath('/cart')
  revalidatePath('/checkout')
  revalidatePath('/account/orders')

  return { success: true, isRazorpay: false, order_number: order.order_number, orderId: order.id }
}

export async function verifyRazorpayPayment(
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  internal_order_id: string
) {
  const supabase = await createClient()

  // 1. Get user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2. Verify signature
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return { success: false, error: 'Razorpay secret not configured' }

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex')

  if (generated_signature !== razorpay_signature) {
    return { success: false, error: 'Payment verification failed: Invalid signature' }
  }

  // 3. Update Order Status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      payment_status: 'paid',
      paid_at: new Date().toISOString()
    })
    .eq('id', internal_order_id)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Failed to update order status:', updateError)
    return { success: false, error: 'Failed to update order status' }
  }

  // 4. Clear Cart
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  revalidatePath('/cart')
  revalidatePath('/checkout')
  revalidatePath('/account/orders')

  return { success: true }
}

export async function placeLocalOrder(data: {
  customer_name: string
  customer_phone: string
  shipping_address: string
  items: any[]
  subtotal: number
  shipping_cost: number
  discount: number
  coupon_code?: string
  total_amount: number
  payment_method: 'Cash on Delivery' | 'Online Payment (Razorpay)'
}) {
  const supabase = await createClient()

  // Generate order number
  const order_number = `${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

  const { data: newOrder, error } = await supabase
    .from('orders')
    .insert([{
      order_number,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      shipping_address: data.shipping_address,
      total_amount: data.total_amount,
      payment_method: data.payment_method,
      payment_status: data.payment_method === 'Cash on Delivery' ? 'pending' : 'paid',
      order_status: 'processing',
      created_at: new Date().toISOString()
    }])
    .select('id, order_number')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true, order_number: newOrder.order_number, id: newOrder.id }
}
