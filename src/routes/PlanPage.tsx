import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Plus, Loader2, Calendar, Layers } from 'lucide-react'
import { useUiStore } from '../store/uiStore'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/tasks/TaskForm'
import { BulkTaskForm } from '../components/tasks/BulkTaskForm'
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
  const { activeDate, isTaskFormOpen, setTaskFormOpen, isBulkFormOpen, setBulkFormOpen } = useUiStore()
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
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b border-carbon-100 dark:border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-carbon-400 dark:text-carbon-500 mb-2 font-black uppercase tracking-[0.2em] text-xs">
            <Calendar className="w-4 h-4" />
            Scheduling
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white italic uppercase">Plan Tomorrow</h1>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-lg text-carbon-500 font-medium">{formattedDisplayDate}</p>
            <button 
              onClick={() => setBulkFormOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-carbon-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              <Layers className="w-3 h-3" />
              Batch Mode
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-black dark:text-white tabular-nums tracking-tighter">
            {tasks.length}
          </div>
          <div className="text-xs font-black text-carbon-400 uppercase tracking-widest mt-1">Total Tasks</div>
        </div>
      </header>

      <div className="pb-32">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-20 premium-card border-dashed bg-transparent">
            <p className="text-carbon-400 font-bold uppercase tracking-widest text-sm">The canvas is empty</p>
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => setTaskFormOpen(true)}
                className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform"
              >
                Single Task
              </button>
              <button 
                onClick={() => setBulkFormOpen(true)}
                className="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform"
              >
                Batch Upload
              </button>
            </div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 flex flex-col gap-4 z-40">
        <button
          onClick={() => setBulkFormOpen(true)}
          className="w-12 h-12 bg-carbon-800 text-white dark:bg-carbon-200 dark:text-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-white/10 dark:border-black/10"
          title="Batch Planning"
        >
          <Layers className="w-6 h-6" />
        </button>
        <button
          onClick={() => setTaskFormOpen(true)}
          className="w-16 h-16 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-white/20 dark:border-black/20"
          title="Add Single Task"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {isTaskFormOpen && <TaskForm />}
      {isBulkFormOpen && <BulkTaskForm />}
    </div>
  )
}
