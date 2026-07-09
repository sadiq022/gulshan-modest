'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { validateCoupon } from '@/actions/admin/coupons'
import { processCheckout, verifyRazorpayPayment } from '@/actions/checkout'
import { SITE } from '@/lib/data'
import { Truck, Tag, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, Lock, Eye, EyeOff, Plus, Minus, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'

type ShippingSettings = {
  flat_rate: number
  free_threshold: number
  cod_charge?: number
  online_discount?: number
}

export default function CheckoutForm({ shipping, isLoggedIn }: { shipping: ShippingSettings, isLoggedIn: boolean }) {
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart()
  const { showToast } = useToast()
  const [pending, startTransition] = useTransition()

  // Shipping Address Form State
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    alternatePhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // Inline account creation (only shown for guests)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
            alternatePhone: parsed.alternatePhone || '',
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
  const codFee = paymentMethod === 'Cash on Delivery' ? (shipping.cod_charge ?? 50) : 0
  
  let discount = 0
  if (activeCoupon) {
    if (activeCoupon.type === 'percentage') {
      discount = Math.round((subtotal * activeCoupon.value) / 100)
    } else {
      discount = activeCoupon.value
    }
  }

  const onlineDiscountPercent = shipping.online_discount ?? 0
  const onlineDiscountAmount = paymentMethod === 'Online Payment (Razorpay)'
    ? Math.round((subtotal * onlineDiscountPercent) / 100)
    : 0

  const grandTotal = Math.max(0, subtotal + shippingFee + codFee - discount - onlineDiscountAmount)

  // Handle Coupon Apply
  const handleApplyCoupon = async () => {
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

  const handleRazorpayPayment = async (orderData: any, addressString: string) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: orderData.amount,
      currency: "INR",
      name: SITE.name,
      description: "Order Payment",
      order_id: orderData.razorpayOrderId,
      handler: async function (response: any) {
        const verifyRes = await verifyRazorpayPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          orderData.orderId
        )
        if (verifyRes.success) {
          setPlacedOrder({
            order_number: orderData.orderNumber,
            id: orderData.orderId,
            total: grandTotal,
            items: [...cart],
            shippingAddress: addressString
          })
          clearCart()
        } else {
          showToast('Payment verification failed. Please contact support.', 'error')
        }
      },
      prefill: {
        name: profile.fullName,
        contact: profile.phone,
      },
      theme: {
        color: "#1E3B2E" // Emerald
      }
    };
    
    // @ts-ignore
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any){
        showToast("Payment failed! Reason: " + response.error.description, "error");
    });
    rzp1.open();
  }

  // Handle Checkout Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error')
      return
    }

    if (!isLoggedIn && password.length < 6) {
      showToast('Please set a password (at least 6 characters) to create your account.', 'error')
      return
    }

    startTransition(async () => {
      const addressString = `${profile.street}, ${profile.city}, ${profile.state} - ${profile.zipCode}`
      const method = paymentMethod === 'Online Payment (Razorpay)' ? 'RAZORPAY' : 'COD'

      const res = await processCheckout(profile, cart, method, isLoggedIn ? undefined : password)

      if (!res.success) {
        showToast(res.error || 'Failed to place order.', 'error')
      } else {
        if (res.isRazorpay) {
          handleRazorpayPayment(res, addressString)
        } else {
          setPlacedOrder({
            order_number: res.order_number,
            id: res.orderId,
            total: grandTotal,
            items: [...cart],
            shippingAddress: addressString
          })
          clearCart()
        }
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Left Column: Shipping Address & Payment Form */}
      <div className="lg:col-span-7 space-y-6">
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
                maxLength={50}
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
                maxLength={10}
                pattern="\d{10}"
                title="Please enter exactly 10 digits"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                Alternate Phone Number <span className="text-ink/30 normal-case font-medium">(Optional)</span>
              </label>
              <input
                type="text"
                maxLength={10}
                pattern="\d{10}"
                title="Please enter exactly 10 digits"
                value={profile.alternatePhone}
                onChange={(e) => setProfile({ ...profile, alternatePhone: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 9876543210"
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
                maxLength={150}
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
                  maxLength={50}
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
                  maxLength={50}
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
                maxLength={6}
                pattern="\d{6}"
                title="Please enter a valid 6-digit PIN code"
                value={profile.zipCode}
                onChange={(e) => setProfile({ ...profile, zipCode: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 110001"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-line shadow-card space-y-4">
            <h2 className="text-lg font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold" /> Create Your Account
            </h2>
            <p className="text-xs text-ink/50 -mt-2">
              We'll set up an account with your phone number ({profile.phone || '—'}) so you can track this order. Just set a password below.
            </p>
            <div>
              <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set a password for your account"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

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
              <span className="font-bold text-ink text-sm">Cash on Delivery (+₹{shipping.cod_charge ?? 50})</span>
              <span className="text-xs text-ink/50 mt-1">Pay COD charge & product value at your doorstep.</span>
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
              <span className="font-bold text-ink text-sm">
                Online Payment {shipping.online_discount ? `(${shipping.online_discount}% Off)` : ''}
              </span>
              <span className="text-xs text-ink/50 mt-1">Pay securely via UPI, Cards, or Netbanking.</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary & Coupon Codes (sticky so the order + Place Order button stay in view) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 border border-cream-line shadow-card space-y-6">
          <h2 className="text-lg font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" /> Order Summary
          </h2>

          <div className="divide-y divide-cream-line max-h-80 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-sm text-ink/50 py-4">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 py-4 items-start">
                  <Link
                    href={`/shop/${item.id}`}
                    className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-cream-line/50 hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/shop/${item.id}`} className="hover:text-emerald transition-colors">
                        <h4 className="font-semibold text-ink text-sm leading-snug line-clamp-2">{item.name}</h4>
                      </Link>
                      <span className="font-semibold text-emerald text-base shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-ink/40">
                      {item.variant_name ? `${item.variant_name} • ` : ''}₹{item.price} each
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-cream-line rounded-full p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 text-ink/60 hover:text-emerald rounded-full hover:bg-cream transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-ink">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 text-ink/60 hover:text-emerald rounded-full hover:bg-cream transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-ink/30 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
            {paymentMethod === 'Cash on Delivery' && (
              <div className="flex justify-between text-xs">
                <span className="text-ink/60">COD Charge</span>
                <span className="font-bold text-ink">₹{codFee}</span>
              </div>
            )}
            {onlineDiscountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald font-semibold">
                <span>Online Payment Discount ({onlineDiscountPercent}%)</span>
                <span>-₹{onlineDiscountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
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
        </div>

        {/* Coupons Form */}
        <div className="bg-white rounded-3xl p-6 border border-cream-line shadow-card space-y-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-gold" /> Have a Coupon?
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleApplyCoupon()
                }
              }}
              placeholder="e.g. EID50, WELCOME100"
              className="flex-1 px-3.5 py-2 rounded-xl border border-cream-line bg-cream/20 text-ink focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all text-xs uppercase"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-emerald hover:bg-emerald-deep text-cream text-xs font-bold rounded-xl transition-all"
            >
              Apply
            </button>
          </div>

          {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          {couponSuccess && <p className="text-xs text-emerald font-semibold">{couponSuccess}</p>}

          <div className="text-[11px] text-ink/40 border-t border-cream-line/50 pt-2 space-y-1">
            <p><strong>EID50</strong> — 50% discount on orders above ₹999</p>
            <p><strong>WELCOME100</strong> — Flat ₹100 discount on orders above ₹499</p>
          </div>
        </div>
      </div>
    </form>
  )
}
