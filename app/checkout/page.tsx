import { getShippingSettings } from '@/actions/admin/shipping'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CheckoutForm from './_components/CheckoutForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Secure Checkout | Gulshan Modest',
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const shipping = await getShippingSettings()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <CheckoutForm shipping={shipping} />
        </div>
      </main>
      <Footer />
    </>
  )
}
