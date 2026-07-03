import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from './_components/LoginForm'

export const metadata = {
  title: 'Login | Gulshan Modest',
  description: 'Login securely with a one-time password.',
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream flex flex-col justify-center py-20 px-5">
        <div className="max-w-md w-full mx-auto bg-cream-deep p-8 rounded-3xl border border-gold/20 shadow-soft">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-ink">Welcome Back</h1>
            <p className="text-ink/70 mt-2 font-body">
              Enter your email to receive a secure login code. No password required.
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
