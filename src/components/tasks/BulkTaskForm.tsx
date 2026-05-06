import { useState } from 'react'
import { X, Plus, Loader2, Trash2, Zap, History } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useCreateTask, useTasks } from '../../hooks/useTasks'
import { format, subDays } from 'date-fns'

interface TaskDraft {
  title: string
  points: number
}

export function BulkTaskForm() {
  const { activeDate, setBulkFormOpen } = useUiStore()
  const createTask = useCreateTask()

  // To support "Clone from Yesterday", we might need to fetch yesterday's tasks
  const yesterdayDate = subDays(activeDate, 1)
  const yesterdayStr = format(yesterdayDate, 'yyyy-MM-dd')
  const { data: yesterdayTasks } = useTasks(yesterdayStr)

  const [drafts, setDrafts] = useState<TaskDraft[]>([{ title: '', points: 5 }])
  const [loading, setLoading] = useState(false)

  const addRow = () => {
    setDrafts([...drafts, { title: '', points: 5 }])
  }

  const removeRow = (index: number) => {
    if (drafts.length > 1) {
      setDrafts(drafts.filter((_, i) => i !== index))
    }
  }

  const updateDraft = (index: number, field: keyof TaskDraft, value: string | number) => {
    const newDrafts = [...drafts]
    newDrafts[index] = { ...newDrafts[index], [field]: value }
    setDrafts(newDrafts)
  }

  const cloneYesterday = () => {
    if (yesterdayTasks && yesterdayTasks.length > 0) {
      const cloned = yesterdayTasks.map(t => ({ title: t.title, points: t.target_points }))
      setDrafts(cloned)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validDrafts = drafts.filter(d => d.title.trim())
    if (validDrafts.length === 0) return

    setLoading(true)
    const dateStr = format(activeDate, 'yyyy-MM-dd')

    try {
      const promises = validDrafts.map(draft =>
        createTask.mutateAsync({
          title: draft.title,
          target_points: draft.points as any,
          planned_for: dateStr,
          is_public: true,
          description: null
        })
      )

      await Promise.all(promises)
      setBulkFormOpen(false)
    } catch (err) {
      console.error('Bulk creation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-carbon-950 rounded-[2.5rem] shadow-2xl border border-carbon-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center px-10 py-8 border-b border-carbon-100 dark:border-white/5 bg-carbon-50/50 dark:bg-white/5">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black dark:text-white">Advanced Day Architect</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-carbon-400 mt-1">Multi-Row Sequential Task Allocation</p>
          </div>
          <div className="flex items-center gap-4">
            {yesterdayTasks && yesterdayTasks.length > 0 && (
              <button
                onClick={cloneYesterday}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
              >
                <History className="w-3.5 h-3.5" />
                Sync Yesterday
              </button>
            )}
            <button onClick={() => setBulkFormOpen(false)} className="p-3 rounded-full hover:bg-carbon-100 dark:hover:bg-white/5 transition-colors">
              <X className="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_100px_48px] gap-4 px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-carbon-400">Objective Description</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-carbon-400 text-center">Value</span>
              <span></span>
            </div>

            {drafts.map((draft, index) => (
              <div key={index} className="grid grid-cols-[1fr_100px_48px] gap-4 group">
                <input
                  autoFocus={index === drafts.length - 1}
                  value={draft.title}
                  onChange={(e) => updateDraft(index, 'title', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && draft.title.trim()) {
                      e.preventDefault()
                      addRow()
                    }
                  }}
                  className="w-full px-6 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all font-bold text-md"
                  placeholder={`Task ${index + 1}...`}
                />
                <select
                  value={draft.points}
                  onChange={(e) => updateDraft(index, 'points', parseInt(e.target.value))}
                  className="w-full px-4 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all font-black text-center appearance-none"
                >
                  {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>{p} Pts</option>)}
                </select>
                <button
                  onClick={() => removeRow(index)}
                  className="flex items-center justify-center text-carbon-300 hover:text-red-500 transition-colors"
                  disabled={drafts.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={addRow}
              className="w-full py-4 mt-4 border-2 border-dashed border-carbon-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-carbon-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <Plus className="w-4 h-4" />
              Append New Row
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-carbon-100 dark:border-white/5 bg-carbon-50/50 dark:bg-white/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-carbon-400">Total Potential</span>
            <span className="text-xl font-black text-black dark:text-white">{drafts.reduce((acc, d) => acc + (d.title.trim() ? d.points : 0), 0)} Points</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !drafts.some(d => d.title.trim())}
            className="px-12 py-5 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-30 shadow-2xl"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6 mr-3" /> Commit Operation</>}
          </button>
        </div>
      </div>
    </div>
  )
}
