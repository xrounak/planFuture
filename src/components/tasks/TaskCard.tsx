import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Target, UserIcon, Trash2 } from 'lucide-react'
import type { Task } from '../../types'
import { useDeleteTask } from '../../hooks/useTasks'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const deleteTask = useDeleteTask()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-brand-900 border border-brand-100 dark:border-brand-800 rounded-xl p-4 flex items-center gap-3 shadow-sm ${isDragging ? 'shadow-lg border-brand-300 z-10' : ''
        }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:bg-brand-50 dark:hover:bg-brand-800 p-2 -m-2 rounded">
        <GripVertical className="w-5 h-5 text-brand-300 dark:text-brand-600" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-brand-900 dark:text-brand-50 truncate">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-brand-600/70 dark:text-brand-100/60 truncate mt-0.5">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-brand-600 dark:text-brand-400">
        <div className="flex items-center gap-1" title="Target Points">
          <Target className="w-4 h-4" />
          {task.target_points}
        </div>
        {!task.is_public && (
          <div className="flex items-center gap-1" title="Private">
            <UserIcon className="w-4 h-4" />
          </div>
        )}
        <button
          onClick={() => deleteTask.mutate({ id: task.id, date: task.planned_for })}
          disabled={deleteTask.isPending}
          className="text-score-0 p-2 -m-2 rounded hover:bg-score-0/10 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
