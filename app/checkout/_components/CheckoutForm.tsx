'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useCart } from '@/context/CartContext'
import { validateCoupon } from '@/actions/admin/coupons'
import { placeLocalOrder } from '@/actions/checkout'
import { SITE } from '@/lib/data'
import { Truck, Tag, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

type ShippingSettings = {
  flat_rate: number
  free_threshold: number
}

export default function CheckoutForm({ shipping }: { shipping: ShippingSettings }) {
  const { cart, cartTotal, clearCart } = useCart()
  const [pending, startTransition] = useTransition()
  
  // Shipping Address Form State
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [activeCoupon, setActiveCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment (Razorpay)'>('Cash on Delivery')

  // Success Modal State
  const [placedOrder, setPlacedOrder] = useState<any>(null)

  // Prefill from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('gulshan-customer-profile')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setProfile({
            fullName: parsed.fullName || '',
            phone: parsed.phone || '',
            street: parsed.street || '',
            city: parsed.city || '',
            state: parsed.state || '',
            zipCode: parsed.zipCode || '',
          })
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  // Calculate checkout details
  const subtotal = cartTotal
  const shippingFee = subtotal >= (shipping.free_threshold ?? 1999) ? 0 : (shipping.flat_rate ?? 99)
  
  let discount = 0
  if (activeCoupon) {
    if (activeCoupon.type === 'percentage') {
      discount = Math.round((subtotal * activeCoupon.value) / 100)
    } else {
      discount = activeCoupon.value
    }
  }

  const grandTotal = Math.max(0, subtotal + shippingFee - discount)

  // Handle Coupon Apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess('')

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.')
      return
    }

    const res = await validateCoupon(couponCode, subtotal)
    if (!res.success) {
      setCouponError(res.error || 'Invalid coupon code')
      setActiveCoupon(null)
    } else {
      setActiveCoupon(res.coupon)
      setCouponSuccess(`Coupon Applied! Discount: ${res.coupon.type === 'percentage' ? `${res.coupon.value}%` : `₹${res.coupon.value}`}`)
    }
  }

  // Handle Checkout Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }

    startTransition(async () => {
      const addressString = `${profile.street}, ${profile.city}, ${profile.state} - ${profile.zipCode}`
      const res = await placeLocalOrder({
        customer_name: profile.fullName,
        customer_phone: profile.phone,
        shipping_address: addressString,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        shipping_cost: shippingFee,
        discount,
        coupon_code: activeCoupon?.code,
        total_amount: grandTotal,
        payment_method: paymentMethod
      })

      if (!res.success) {
        alert(res.error || 'Failed to place order.')
      } else {
        setPlacedOrder({
          order_number: res.order_number,
          id: res.id,
          total: grandTotal,
          items: [...cart],
          shippingAddress: addressString
        })
        clearCart()
      }
    })
  }

  // Format Whatsapp Link for Success Modal
  const getWhatsappLink = () => {
    if (!placedOrder) return ''
    const itemsText = placedOrder.items.map((i: any) => `- ${i.name} (x${i.quantity})`).join('\n')
    const message = `Hi Gulshan Modest!\n\nI just placed an order:\nOrder Number: *${placedOrder.order_number}*\nItems:\n${itemsText}\nTotal Amount: *₹${placedOrder.total.toLocaleString('en-IN')}*\nPayment Method: *${paymentMethod}*\n\nShipping Address: ${placedOrder.shippingAddress}\n\nPlease confirm my order. Thank you!`
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
  }

  if (placedOrder) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-cream-line shadow-card text-center space-y-6 animate-fade-in mt-6">
        <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-ink">Order Placed Successfully!</h2>
          <p className="text-sm text-ink/60 mt-1">Thank you for shopping with Gulshan Modest.</p>
        </div>

        <div className="p-4 bg-cream/40 rounded-2xl border border-cream-line/50 text-left space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-ink/50 uppercase font-semibold">Order Number</span>
            <span className="font-bold text-ink">{placedOrder.order_number}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-ink/50 uppercase font-semibold">Grand Total</span>
            <span className="font-bold text-emerald">₹{placedOrder.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-ink/50 uppercase font-semibold">Payment Method</span>
            <span className="font-bold text-ink">{paymentMethod}</span>
          </div>
        </div>

        <div className="space-y-2">
          <a
            href={getWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald text-cream font-body font-semibold rounded-full shadow-card hover:bg-emerald-deep transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.49 4.975 1.491 5.474 0 9.932-4.457 9.935-9.931a9.885 9.885 0 0 0-2.883-7.054A9.882 9.882 0 0 0 11.758 1.15c-5.483 0-9.94 4.458-9.944 9.934-.002 1.936.507 3.82 1.476 5.489L2.247 20.89l4.4-.736z" />
            </svg>
            Confirm via WhatsApp
          </a>
          <a
            href="/"
            className="w-full inline-flex items-center justify-center py-3 text-sm text-ink/60 hover:text-emerald font-semibold transition-colors"
          >
            Return to Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Shipping Address & Payment Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-line shadow-card space-y-6">
          <h2 className="text-lg font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-5 h-5 text-gold" /> Shipping Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="e.g. Sumaiya Khan"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                required
                value={profile.street}
                onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                placeholder="e.g. Apartment number, street name"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                ZIP / PIN Code
              </label>
              <input
                type="text"
                required
                value={profile.zipCode}
                onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                placeholder="e.g. 110001"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-line shadow-card space-y-6">
          <h2 className="text-lg font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gold" /> Payment Option
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'Cash on Delivery'
                ? 'border-emerald bg-emerald/5'
                : 'border-cream-line bg-white hover:border-cream-line-dark'
            }`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
                className="sr-only"
              />
              <span className="font-bold text-ink text-sm">Cash on Delivery</span>
              <span className="text-xs text-ink/50 mt-1">Pay flat shipping & product value at your doorstep.</span>
            </label>

            <label className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'Online Payment (Razorpay)'
                ? 'border-emerald bg-emerald/5'
                : 'border-cream-line bg-white hover:border-cream-line-dark'
            }`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Online Payment (Razorpay)'}
                onChange={() => setPaymentMethod('Online Payment (Razorpay)')}
                className="sr-only"
              />
              <span className="font-bold text-ink text-sm">Online Payment</span>
              <span className="text-xs text-ink/50 mt-1">Pay securely via UPI, Cards, or Netbanking.</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending || cart.length === 0}
          className="w-full py-4 px-4 bg-emerald text-cream font-body font-semibold rounded-full shadow-card hover:bg-emerald-deep transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {pending ? (
            <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Place Secure Order — ₹{grandTotal.toLocaleString('en-IN')}
            </>
          )}
        </button>
      </form>

      {/* Right Column: Order Summary & Coupon Codes */}
      <div className="lg:col-span-5 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 border border-cream-line shadow-card space-y-6">
          <h2 className="text-lg font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" /> Order Summary
          </h2>

          <div className="divide-y divide-cream-line max-h-60 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-sm text-ink/50 py-4">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 items-center">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 border border-cream-line/50">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-ink text-xs truncate">{item.name}</h4>
                    <p className="text-[10px] text-ink/50">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-semibold text-emerald text-sm">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Pricing calculations */}
          <div className="border-t border-cream-line pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-ink/60">Subtotal</span>
              <span className="font-bold text-ink">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-ink/60">Shipping</span>
              <span className="font-bold text-ink">
                {shippingFee === 0 ? <span className="text-emerald font-semibold uppercase">Free</span> : `₹${shippingFee}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald">
                <span>Discount ({activeCoupon?.code})</span>
                <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-cream-line pt-3">
              <span className="font-bold text-ink">Grand Total</span>
              <span className="font-display font-bold text-lg text-emerald">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Coupons Form */}
        <div className="bg-white rounded-3xl p-6 border border-cream-line shadow-card space-y-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-gold" /> Have a Coupon?
          </h3>

          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. EID50, WELCOME100"
              className="flex-1 px-3.5 py-2 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-xs uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald hover:bg-emerald-deep text-cream text-xs font-bold rounded-xl transition-all"
            >
              Apply
            </button>
          </form>

          {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          {couponSuccess && <p className="text-xs text-emerald font-semibold">{couponSuccess}</p>}

          <div className="text-[11px] text-ink/40 border-t border-cream-line/50 pt-2 space-y-1">
            <p><strong>EID50</strong> — 50% discount on orders above ₹999</p>
            <p><strong>WELCOME100</strong> — Flat ₹100 discount on orders above ₹499</p>
          </div>
        </div>
      </div>
    </div>
  )
}
