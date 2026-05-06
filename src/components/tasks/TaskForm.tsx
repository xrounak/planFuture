import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { X, Star, Loader2 } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useCreateTask } from '../../hooks/useTasks'
import type { Task } from '../../types'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(255).optional(),
  target_points: z.number().min(1).max(5),
  is_public: z.boolean(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export function TaskForm() {
  const { activeDate, setTaskFormOpen } = useUiStore()
  const createTask = useCreateTask()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      target_points: 5,
      is_public: true,
    }
  })

  const targetPoints = watch('target_points')

  const onSubmit = (data: TaskFormValues) => {
    createTask.mutate({
      ...data,
      target_points: data.target_points as Extract<Task['target_points'], number>,
      planned_for: format(activeDate, 'yyyy-MM-dd'),
      description: data.description || null,
    }, {
      onSuccess: () => {
        setTaskFormOpen(false)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-carbon-950 rounded-[2.5rem] shadow-2xl border border-carbon-200 dark:border-white/10 overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-carbon-100 dark:border-white/5">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-black dark:text-white">New Objective</h2>
          <button onClick={() => setTaskFormOpen(false)} className="p-2 rounded-full hover:bg-carbon-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-carbon-400">Title</label>
            <input
              {...register('title')}
              autoFocus
              className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold"
              placeholder="Primary Goal"
            />
            {errors.title && <p className="text-red-500 text-[10px] mt-1 font-black uppercase">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-carbon-400">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full px-5 py-4 rounded-2xl border border-carbon-200 focus:outline-none focus:ring-2 focus:ring-black bg-white dark:bg-black dark:border-white/10 dark:focus:ring-white transition-all duration-300 font-bold text-sm"
              placeholder="Additional Intelligence"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-3 text-carbon-400">Value Allocation</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(pt => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setValue('target_points', pt)}
                  className={`p-3 rounded-xl flex-1 border transition-all flex flex-col items-center gap-1 ${targetPoints === pt
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-lg'
                      : 'border-carbon-200 dark:border-white/10 text-carbon-400 hover:bg-carbon-50 dark:hover:bg-white/5'
                    }`}
                >
                  <Star className={`w-5 h-5 ${targetPoints >= pt ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-black">{pt}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-carbon-100 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-carbon-400">Public Transmission</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('is_public')} className="sr-only peer" />
              <div className="w-11 h-6 bg-carbon-200 peer-focus:outline-none rounded-full peer dark:bg-carbon-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-carbon-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-carbon-600 peer-checked:bg-black dark:peer-checked:bg-white"></div>
            </label>
          </div>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="w-full py-4 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-70 shadow-2xl mt-4"
          >
            {createTask.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Selection'}
          </button>
        </form>
      </div>
    </div>
  )
}
