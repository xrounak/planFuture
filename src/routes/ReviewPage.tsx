import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Loader2, ClipboardCheck } from 'lucide-react'
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
      <div className="flex justify-center p-20">
        <Loader2 className="w-12 h-12 animate-spin text-black dark:text-white" />
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-20 premium-card border-dashed bg-transparent mt-8">
        <p className="text-carbon-400 font-bold uppercase tracking-widest text-sm">No data points for review today</p>
      </div>
    )
  }

  const { total_earned, total_possible, completion_pct } = computeDailyScore(tasks.map(t => ({
    ...t,
    actual_points: localScores[t.id] ?? t.actual_points
  })))

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b border-carbon-100 dark:border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-carbon-400 dark:text-carbon-500 mb-2 font-black uppercase tracking-[0.2em] text-xs">
            <ClipboardCheck className="w-4 h-4" />
            Operational Review
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white italic uppercase leading-none">Post-Score</h1>
          <p className="text-lg text-carbon-500 font-medium mt-3 uppercase tracking-tight">Evaluate daily output</p>
        </div>
      </header>

      <div className="space-y-4">
        {tasks.map(task => {
          const isReadonly = task.actual_points !== null
          return (
            <div key={task.id} className="premium-card p-6">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-black dark:text-white uppercase italic tracking-tighter">{task.title}</h3>
                  {task.description && <p className="text-sm text-carbon-500 font-medium mt-1">{task.description}</p>}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Weight</div>
                  <div className="text-xl font-black text-black dark:text-white">{task.target_points}</div>
                </div>
              </div>

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

      <div className="pb-32">
        {!hasUnscoredTasks || isSubmitted ? (
          <div className="premium-card p-10 flex flex-col items-center">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-carbon-400 mb-8">Daily Performance Index</h2>
            <ProgressRing percentage={completion_pct} />
            <div className="mt-10 flex gap-12 text-center border-t border-carbon-100 dark:border-white/5 pt-8 w-full justify-center">
              <div>
                <div className="text-3xl font-black text-black dark:text-white tabular-nums tracking-tighter">{total_earned}</div>
                <div className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] mt-1">Earned</div>
              </div>
              <div>
                <div className="text-3xl font-black text-black dark:text-white opacity-40 tabular-nums tracking-tighter">{total_possible}</div>
                <div className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] mt-1">Possible</div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="w-full py-5 rounded-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center disabled:opacity-50 shadow-2xl"
          >
            {scoreTask.isPending || submitSummary.isPending ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <><CheckCircle2 className="w-8 h-8 mr-3" /> Finalize Transmission</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
