import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types'
import { useQueryClient } from '@tanstack/react-query'

interface EditProfileModalProps {
  profile: Profile
  onClose: () => void
  onSuccess: (updatedProfile: Profile) => void
}

export function EditProfileModal({ profile, onClose, onSuccess }: EditProfileModalProps) {
  const [username, setUsername] = useState(profile.username)
  const [nickname, setNickname] = useState(profile.nickname || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await (supabase.from('profiles') as any)
      .update({
        username,
        nickname: nickname || null,
        avatar_url: avatarUrl || null
      })
      .eq('id', profile.id)
      .select()
      .single()

    setLoading(false)

    if (error) {
      setError(error.message)
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      onSuccess(data as Profile)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-brand-900 rounded-3xl shadow-2xl border border-brand-200 dark:border-brand-800 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-brand-900 dark:text-brand-50">Edit Profile</h2>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
            />
            <p className="text-xs text-brand-500 mt-1">This must be unique.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Nickname (Optional)</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
              placeholder="How you want to be called"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-brand-900 dark:text-brand-100">Avatar URL (Optional)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 dark:border-brand-700 transition-all duration-300"
              placeholder="https://example.com/my-avatar.png"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 text-white font-bold hover:from-brand-600 hover:to-violet-700 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-lg shadow-brand-500/25"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  )
}
