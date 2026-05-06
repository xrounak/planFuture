import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Target, UserIcon, Trash2 } from 'lucide-react'
import type { Task } from '../../types'
import { useDeleteTask } from '../../hooks/useTasks'
import { useRef } from 'react'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const deleteTask = useDeleteTask()
  const cardRef = useRef<HTMLDivElement>(null)

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node)
        // @ts-ignore
        cardRef.current = node
      }}
      style={style}
      onMouseMove={handleMouseMove}
      className={`premium-card p-5 flex items-center gap-4 transition-all duration-500 ${
        isDragging ? 'z-50 shadow-2xl scale-105 border-white/20' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab text-carbon-400 hover:text-black dark:text-carbon-600 dark:hover:text-white transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-black dark:text-white tracking-tight leading-tight">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-carbon-500 dark:text-carbon-400 truncate mt-1">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-tighter text-carbon-400 mb-0.5">Points</span>
          <div className="flex items-center gap-1 font-black text-black dark:text-white">
            <Target className="w-4 h-4" />
            {task.target_points}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!task.is_public && (
            <span title="Private">
              <UserIcon className="w-4 h-4 text-carbon-400" />
            </span>
          )}
          <button
            onClick={() => deleteTask.mutate({ id: task.id, date: task.planned_for })}
            disabled={deleteTask.isPending}
            className="text-carbon-300 hover:text-red-500 transition-colors p-1"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
