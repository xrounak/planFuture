import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Plus, Loader2 } from 'lucide-react'
import { useUiStore } from '../store/uiStore'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskCard } from '../components/tasks/TaskCard'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Task } from '../types'

export function PlanPage() {
  const { activeDate, isTaskFormOpen, setTaskFormOpen } = useUiStore()
  const dateStr = format(activeDate, 'yyyy-MM-dd')
  const { data: serverTasks, isLoading } = useTasks(dateStr)
  
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (serverTasks) setTasks(serverTasks)
  }, [serverTasks])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id)
        const newIndex = items.findIndex((t) => t.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const formattedDisplayDate = format(activeDate, 'EEEE, MMM d')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-brand-900 p-4 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800">
        <div>
          <h1 className="text-2xl font-bold">Plan Tomorrow</h1>
          <p className="text-sm text-brand-600 dark:text-brand-300 mt-1">{formattedDisplayDate}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-1">Tasks</div>
          <div className="text-2xl font-bold bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-400 py-1 px-4 rounded-full">
            {tasks.length}
          </div>
        </div>
      </div>

      <div className="pb-24">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-8 bg-brand-50 dark:bg-brand-900/50 rounded-2xl border border-dashed border-brand-200 dark:border-brand-700">
            <p className="text-brand-600/70 dark:text-brand-400">No tasks planned for this day.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <button
        onClick={() => setTaskFormOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-brand-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-600 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isTaskFormOpen && <TaskForm />}
    </div>
  )
}
