import { useState } from 'react'
import { X, Loader2, Camera } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types'

interface Props {
  profile: Profile
  onClose: () => void
  onUpdate: (updatedProfile: Profile) => void
}

export function EditProfileModal({ profile, onClose, onUpdate }: Props) {
  const [username, setUsername] = useState(profile.username || '')
  const [nickname, setNickname] = useState(profile.nickname || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
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

    if (error) {
      setError(error.message)
    } else {
      onUpdate(data)
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-carbon-950 rounded-[2.5rem] shadow-2xl border border-carbon-200 dark:border-white/10 overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-carbon-100 dark:border-white/5">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-black dark:text-white">Profile Config</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-carbon-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>
        
        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="flex flex-col items-center mb-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center overflow-hidden border-4 border-white dark:border-black shadow-2xl transition-all group-hover:scale-105">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black italic">{username.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-carbon-400 mt-4">Visual Identity</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Unique Identifier</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold"
                placeholder="USERNAME"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Operational Alias</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold"
                placeholder="NICKNAME"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-carbon-400">Resource URL (Avatar)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold"
                placeholder="https://image-source.com/pfp.jpg"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-2xl mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Synchronize Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
