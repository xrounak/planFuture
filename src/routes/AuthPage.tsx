import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })
  const navigate = useNavigate()
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      navigate('/plan', { replace: true })
    }
  }, [session, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', isError: false })

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/plan',
      }
    })

    if (error) {
      setMessage({ text: error.message, isError: true })
    } else {
      setMessage({ text: 'Check your email for the login link!', isError: false })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-brand-900 rounded-2xl shadow-xl p-8 border border-brand-100 dark:border-brand-600">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-900 dark:text-brand-50 mb-2">TomorrowOS</h1>
          <p className="text-brand-600 dark:text-brand-100">Plan tonight. Score tomorrow.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50 dark:bg-brand-900 dark:border-brand-600"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5 mr-2" /> Send Magic Link</>}
          </button>
          
          {message.text && (
            <div className={`p-4 rounded-lg text-sm ${message.isError ? 'bg-score-0/10 text-score-0' : 'bg-brand-100 text-brand-900'}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
