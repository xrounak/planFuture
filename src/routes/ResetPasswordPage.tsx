import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2, ShieldCheck } from 'lucide-react'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })
  const navigate = useNavigate()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', isError: true })
      return
    }

    setLoading(true)
    setMessage({ text: '', isError: false })

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage({ text: error.message, isError: true })
    } else {
      setMessage({ text: 'Access restored. Redirecting...', isError: false })
      setTimeout(() => navigate('/plan'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-carbon-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md p-10 bg-white/80 dark:bg-carbon-950 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-carbon-200 dark:border-white/10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-full bg-black dark:bg-white text-white dark:text-black mb-6 shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black dark:text-white leading-none">Security Override</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-carbon-400 mt-3">Establishing new authentication credentials.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">New Secret Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Verify Secret Key</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-2xl mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Apply Credentials'}
          </button>
        </form>

        {message.text && (
          <div className={`mt-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${message.isError ? 'bg-red-50 text-red-600 border-red-100' : 'bg-carbon-50 text-carbon-900 border-carbon-100'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
