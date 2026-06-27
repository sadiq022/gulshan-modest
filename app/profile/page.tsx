import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileManager from './_components/ProfileManager'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'My Profile | Gulshan Modest',
  description: 'Manage your shipping address, contact details, and order tracking.',
}

export default async function CustomerProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let adminProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    adminProfile = data
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-xl mx-auto px-5">
          <div className="text-center mb-8">
            <div className="eyebrow justify-center inline-flex items-center gap-2">
              <span className="h-px w-6 bg-gold" />
              Customer Account
              <span className="h-px w-6 bg-gold" />
            </div>
            <h1 className="section-heading mt-3">My Profile</h1>
            <p className="section-sub mt-2">
              Manage your default shipping address and order details for quicker checkouts.
            </p>
          </div>

          <ProfileManager adminProfile={adminProfile} />
        </div>
      </main>
      <Footer />
    </>
  )
}
