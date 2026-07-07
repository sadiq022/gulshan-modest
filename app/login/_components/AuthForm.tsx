'use client'

import React, { useState, useTransition } from 'react'
import { login, register } from '@/actions/auth'
import { Loader2, Phone, Lock, User, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function AuthForm({ redirectTo }: { redirectTo?: string }) {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let res
      if (mode === 'LOGIN') {
        res = await login({}, formData)
      } else {
        res = await register({}, formData)
      }

      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
          <span className="font-semibold mt-0.5">Oops!</span> 
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirect_to" value={redirectTo} />}
        {mode === 'REGISTER' && (
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-ink/70 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-line bg-cream focus:outline-none focus:border-gold transition-colors"
                placeholder="Ayesha Khan"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink/70 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-line bg-cream focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g. 98765 43210"
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
          </div>
        </div>

        {mode === 'REGISTER' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink/70 mb-1">
              Email Address <span className="text-ink/40 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-line bg-cream focus:outline-none focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink/70 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-cream-line bg-cream focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 px-4 bg-ink text-cream rounded-xl font-semibold hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {pending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === 'LOGIN' ? 'Login Securely' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-cream-line text-center">
        <p className="text-sm text-ink/70">
          {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')
            setError('')
          }}
          className="mt-1 font-semibold text-ink hover:text-gold transition-colors underline underline-offset-4"
        >
          {mode === 'LOGIN' ? 'Create an Account' : 'Login Here'}
        </button>
      </div>
    </div>
  )
}
