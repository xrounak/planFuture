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
    <div className="min-h-screen flex items-center justify-center p-4 bg-carbon-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-carbon-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-carbon-200 dark:border-carbon-800">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-2 bg-black dark:bg-white bg-clip-text text-transparent uppercase italic tracking-tighter">TomorrowOS</h1>
          <p className="text-carbon-500 font-bold uppercase tracking-widest text-[10px]">Plan tonight. Score tomorrow.</p>
        </div>

        {!isForgotPassword ? (
          <>
            <div className="flex bg-carbon-100 dark:bg-white/5 p-1 rounded-full mb-8">
              <button 
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-tighter rounded-full transition-all ${!isSignUp ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl' : 'text-carbon-500 hover:text-black dark:hover:text-white'}`}
                onClick={() => { setIsSignUp(false); setMessage({ text: '', isError: false }) }}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-tighter rounded-full transition-all ${isSignUp ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl' : 'text-carbon-500 hover:text-black dark:hover:text-white'}`}
                onClick={() => { setIsSignUp(true); setMessage({ text: '', isError: false }) }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300"
                    placeholder="ALPHAX"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300"
                  placeholder="YOU@EXAMPLE.COM"
                />
              </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-carbon-400">Password</label>
                  {!isSignUp && (
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-carbon-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-2xl"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Initialize' : 'Authorize')}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black dark:text-white">Reset Protocol</h2>
            <p className="text-xs text-carbon-500 font-bold uppercase tracking-tight mb-4">Enter email to receive recovery transmission.</p>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300"
                placeholder="YOU@EXAMPLE.COM"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Transmit Link'}
            </button>
            <button 
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-[10px] font-black uppercase tracking-widest text-carbon-400 hover:text-black dark:hover:text-white transition-colors mt-2"
            >
              Abrot & Return
            </button>
          </form>
        )}
        
        {message.text && (
          <div className={`mt-6 p-4 rounded-xl text-sm ${message.isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-carbon-50 text-carbon-900 border border-carbon-100'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
