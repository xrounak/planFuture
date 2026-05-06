import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })
  const navigate = useNavigate()
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      navigate('/plan', { replace: true })
    }
  }, [session, navigate])

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', isError: false })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })

    if (error) setMessage({ text: error.message, isError: true })
    else setMessage({ text: 'Password reset link sent! Check your email.', isError: false })
    
    setLoading(false)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', isError: false })

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      })
      if (error) setMessage({ text: error.message, isError: true })
      else if (data.user && !data.session) setMessage({ text: 'Check your email to confirm your account!', isError: false })
      else navigate('/plan')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) setMessage({ text: error.message, isError: true })
      else navigate('/plan')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-brand-200 dark:border-brand-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">TomorrowOS</h1>
          <p className="text-brand-600/70 dark:text-brand-300/70 font-medium">Plan tonight. Score tomorrow.</p>
        </div>

        {!isForgotPassword ? (
          <>
            <div className="flex bg-brand-100/50 dark:bg-brand-800/50 p-1 rounded-xl mb-6">
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-white dark:bg-brand-700 shadow-sm text-brand-900 dark:text-brand-50' : 'text-brand-600/70 dark:text-brand-300/70 hover:text-brand-900 dark:hover:text-brand-50'}`}
                onClick={() => { setIsSignUp(false); setMessage({ text: '', isError: false }) }}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-white dark:bg-brand-700 shadow-sm text-brand-900 dark:text-brand-50' : 'text-brand-600/70 dark:text-brand-300/70 hover:text-brand-900 dark:hover:text-brand-50'}`}
                onClick={() => { setIsSignUp(true); setMessage({ text: '', isError: false }) }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
                    placeholder="cool_user123"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-brand-900 dark:text-brand-100">Password</label>
                  {!isSignUp && (
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 text-white font-bold hover:from-brand-600 hover:to-violet-700 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-lg shadow-brand-500/25"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-5">
            <h2 className="text-xl font-bold text-brand-900 dark:text-brand-50 mb-2">Reset Password</h2>
            <p className="text-sm text-brand-600/70 dark:text-brand-300/70 mb-4">Enter your email and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 text-white font-bold hover:from-brand-600 hover:to-violet-700 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-lg shadow-brand-500/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
            </button>
            <button 
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors mt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}
        
        {message.text && (
          <div className={`mt-6 p-4 rounded-xl text-sm ${message.isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-50 text-brand-900 border border-brand-100'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
