import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useTasks, useScoreTask } from '../hooks/useTasks'
import { useSubmitDailySummary } from '../hooks/useReview'
import { ScoreSlider } from '../components/tasks/ScoreSlider'
import { ProgressRing } from '../components/ui/ProgressRing'
import { computeDailyScore } from '../lib/scoring'
import type { ScoreValue } from '../types'

export function ReviewPage() {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const { data: tasks, isLoading } = useTasks(todayStr)

  const scoreTask = useScoreTask()
  const submitSummary = useSubmitDailySummary()

  const [localScores, setLocalScores] = useState<Record<string, ScoreValue>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleScoreChange = (taskId: string, score: ScoreValue) => {
    setLocalScores(prev => ({ ...prev, [taskId]: score }))
  }

  const handleSubmit = async () => {
    if (!tasks) return

    const scoredPromises = Object.entries(localScores).map(([id, points]) =>
      scoreTask.mutateAsync({ id, actual_points: points })
    )

    await Promise.all(scoredPromises)

    const updatedTasks = tasks.map(t => ({
      ...t,
      actual_points: localScores[t.id] ?? t.actual_points
    }))

    const { total_earned, total_possible } = computeDailyScore(updatedTasks)

    await submitSummary.mutateAsync({
      date: todayStr,
      total_tasks: updatedTasks.length,
      scored_tasks: updatedTasks.filter(t => t.actual_points !== null).length,
      total_earned,
      total_possible
    })

    setIsSubmitted(true)
  }

  const hasUnscoredTasks = tasks?.some(t => t.actual_points === null)
  const isSubmitDisabled = !hasUnscoredTasks || Object.keys(localScores).length === 0 || scoreTask.isPending || submitSummary.isPending

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-brand-50 dark:bg-brand-900/50 rounded-2xl border border-dashed border-brand-200 dark:border-brand-700 mt-8">
        <p className="text-brand-600/70 dark:text-brand-400">No tasks were planned for today.</p>
      </div>
    )
  }

  const { total_earned, total_possible, completion_pct } = computeDailyScore(tasks.map(t => ({
    ...t,
    actual_points: localScores[t.id] ?? t.actual_points
  })))

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800 text-center">
        <h1 className="text-2xl font-bold mb-2">Review Today</h1>
        <p className="text-sm text-brand-600 dark:text-brand-300">
          How much did you accomplish?
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map(task => {
          const isReadonly = task.actual_points !== null
          return (
            <div key={task.id} className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-100 dark:border-brand-800 shadow-sm">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {task.description && <p className="text-sm text-brand-600/70 mb-2">{task.description}</p>}

              <ScoreSlider
                targetPoints={task.target_points}
                initialScore={localScores[task.id] ?? task.actual_points}
                readOnly={isReadonly}
                onChange={(val) => !isReadonly && handleScoreChange(task.id, val)}
              />
            </div>
          )
        })}
      </div>

      {!hasUnscoredTasks || isSubmitted ? (
        <div className="bg-white dark:bg-brand-900 p-8 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6">Daily Summary</h2>
          <ProgressRing percentage={completion_pct} />
          <div className="mt-6 flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-brand-500">{total_earned}</div>
              <div className="text-xs uppercase font-semibold text-brand-400">Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-900 dark:text-brand-50">{total_possible}</div>
              <div className="text-xs uppercase font-semibold text-brand-400">Possible</div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full py-4 rounded-xl bg-brand-500 text-white font-bold text-lg hover:bg-brand-600 transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {scoreTask.isPending || submitSummary.isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <><CheckCircle2 className="w-6 h-6 mr-2" /> Submit Review</>
          )}
        </button>
      )}
    </div>
  )
}
