import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { X, Save, Star } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-brand-900 rounded-2xl shadow-xl w-full border border-brand-100 dark:border-brand-600">
        <div className="flex justify-between items-center p-4 border-b border-brand-50 dark:border-brand-800">
          <h2 className="text-lg font-bold">Plan a Task</h2>
          <button onClick={() => setTaskFormOpen(false)} className="p-2 rounded-full hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors">
            <X className="w-5 h-5 text-brand-600 dark:text-brand-100" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title')}
              autoFocus
              className="w-full px-4 py-2 rounded-lg border border-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50 dark:bg-brand-900 dark:border-brand-600"
              placeholder="What do you want to accomplish?"
            />
            {errors.title && <p className="text-score-0 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50 dark:bg-brand-900 dark:border-brand-600"
              placeholder="Add some details..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Target Points</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(pt => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setValue('target_points', pt)}
                  className={`p-2 rounded-lg flex-1 border transition-all ${
                    targetPoints === pt 
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-800 text-brand-600 dark:text-brand-400' 
                    : 'border-brand-100 dark:border-brand-600 text-brand-400/50 hover:bg-brand-50 dark:hover:bg-brand-800'
                  }`}
                >
                  <Star className={`w-6 h-6 mx-auto ${targetPoints >= pt ? 'fill-current' : ''}`} />
                  <span className="text-xs font-semibold mt-1 block">{pt}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">Make Public</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('is_public')} className="sr-only peer" />
              <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer dark:bg-brand-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-brand-600 peer-checked:bg-brand-500"></div>
            </label>
          </div>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="w-full py-3 px-4 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors flex items-center justify-center disabled:opacity-50 mt-4"
          >
            {createTask.isPending ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Task</>}
          </button>
        </form>
      </div>
    </div>
  )
}
