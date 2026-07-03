'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  
  const supabase = createClient()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setStep('OTP')
    setMessage('A 6-digit pin has been sent to your email.')
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Login successful! Redirecting...')
    
    // Redirect to profile or where they came from
    // In a real scenario you might have a ?redirect=/checkout in the URL
    router.push('/profile')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 bg-emerald/10 text-emerald rounded-xl text-sm border border-emerald/20">
          {message}
        </div>
      )}

      {step === 'EMAIL' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink/70 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-line bg-cream focus:outline-none focus:border-gold transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-ink text-cream rounded-xl font-semibold hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Login Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-ink/70 mb-1">
              Enter 6-Digit Code
            </label>
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg font-bold rounded-xl border border-cream-line bg-cream focus:outline-none focus:border-gold transition-colors"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 px-4 bg-emerald text-cream rounded-xl font-semibold hover:bg-emerald-deep transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Verify & Login <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setStep('EMAIL')
              setOtp('')
              setMessage('')
              setError('')
            }}
            className="w-full text-sm text-ink/60 hover:text-ink transition-colors underline underline-offset-4 mt-2"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  )
}
