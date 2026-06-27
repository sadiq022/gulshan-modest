'use client'

import { useState, useTransition } from 'react'
import { updateGlobalHeroText } from '@/actions/admin/hero'
import { Check, Loader2, Type } from 'lucide-react'

export function GlobalHeroTextForm({ initialData }: { initialData: any }) {
  const [data, setData] = useState({
    title: initialData.title || '',
    subtitle: initialData.subtitle || '',
    button_text: initialData.button_text || '',
    button_link: initialData.button_link || ''
  })
  
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = () => {
    setError(null)
    setSuccess(false)
    
    startTransition(async () => {
      const result = await updateGlobalHeroText(data)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Type className="w-5 h-5 text-stone-400" />
        <h2 className="text-lg font-bold text-stone-900">Global Text Overlay</h2>
      </div>

      <p className="text-sm text-stone-500 mb-6 leading-relaxed">
        This text will be displayed prominently over all the sliding background images. It stays static while the images transition behind it.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1.5">Heading</label>
          <input
            type="text"
            maxLength={255}
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="e.g., Premium Indian Spices"
            className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1.5">Subheading</label>
          <textarea
            value={data.subtitle}
            maxLength={500}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            placeholder="e.g., Authentic flavors delivered straight to your kitchen."
            rows={3}
            className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Button Text</label>
            <input
              type="text"
              maxLength={50}
              value={data.button_text}
              onChange={(e) => setData({ ...data, button_text: e.target.value })}
              placeholder="e.g., Shop Now"
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">Button Link</label>
            <input
              type="text"
              maxLength={255}
              value={data.button_link}
              onChange={(e) => setData({ ...data, button_link: e.target.value })}
              placeholder="e.g., /shop"
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Text'}
        </button>
        
        {success && (
          <span className="flex items-center gap-2 text-sm font-medium text-green-600">
            <Check className="w-4 h-4" />
            Saved successfully!
          </span>
        )}
      </div>
    </div>
  )
}
