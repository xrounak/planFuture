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
      setMessage({ text: 'Password updated successfully! Redirecting...', isError: false })
      setTimeout(() => navigate('/plan'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-brand-200 dark:border-brand-800">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-brand-100 dark:bg-brand-800 mb-4">
            <ShieldCheck className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold text-brand-900 dark:text-brand-50">Set New Password</h1>
          <p className="text-sm text-brand-600/70 dark:text-brand-300/70">Secure your account with a new password.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 text-white font-bold hover:from-brand-600 hover:to-violet-700 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-lg shadow-brand-500/25"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
          </button>
        </form>

        {message.text && (
          <div className={`mt-6 p-4 rounded-xl text-sm ${message.isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-50 text-brand-900 border border-brand-100'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
