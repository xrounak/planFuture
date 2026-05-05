import { useState } from 'react'
import { SCORE_LABELS } from '../../types'
import type { ScoreValue } from '../../types'

interface ScoreSliderProps {
  initialScore?: number | null
  targetPoints: number
  readOnly?: boolean
  onChange: (score: ScoreValue) => void
}

export function ScoreSlider({ initialScore, targetPoints, readOnly, onChange }: ScoreSliderProps) {
  const [value, setValue] = useState<number>(initialScore ?? 0)

  const colorMap = [
    'text-score-0',
    'text-score-1',
    'text-score-2',
    'text-score-3',
    'text-score-4',
    'text-score-5',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) as ScoreValue
    setValue(val)
    onChange(val)
  }

  const emojis = ['❌', '🌱', '🔄', '⚡', '🎯', '✅']

  return (
    <div className="w-full flex flex-col items-center gap-2 mt-4">
      <div className="flex w-full items-center justify-between px-2">
        <span className="text-xl">{emojis[0]}</span>
        <span className="text-xl">{emojis[2]}</span>
        <span className="text-xl">{emojis[5]}</span>
      </div>
      
      <input
        type="range"
        min="0"
        max={targetPoints}
        step="1"
        value={value}
        onChange={handleChange}
        disabled={readOnly}
        className={`w-full h-3 rounded-lg appearance-none cursor-pointer ${
          readOnly ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          background: `linear-gradient(to right, 
            #ef4444 0%, 
            #f97316 20%, 
            #eab308 40%, 
            #84cc16 60%, 
            #22c55e 80%, 
            #10b981 100%)`
        }}
      />
      
      <div className="flex flex-col items-center">
        <span className={`text-sm font-bold ${colorMap[value]}`}>
          {value} / {targetPoints} Points
        </span>
        <span className="text-xs text-brand-500 font-medium">{SCORE_LABELS[value as ScoreValue]}</span>
      </div>
    </div>
  )
}
