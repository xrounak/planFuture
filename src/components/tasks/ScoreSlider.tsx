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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) as ScoreValue
    setValue(val)
    onChange(val)
  }

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <input
          type="range"
          min="0"
          max={targetPoints}
          step="1"
          value={value}
          onChange={handleChange}
          disabled={readOnly}
          className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-black dark:accent-white ${
            readOnly ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          style={{
            background: `linear-gradient(to right, 
              #000 0%, 
              #333 50%, 
              #666 100%)`
          }}
        />
        <div className="flex justify-between mt-3">
          {[...Array(targetPoints + 1)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-1 h-1 rounded-full mb-1 ${value >= i ? 'bg-black dark:bg-white' : 'bg-carbon-200 dark:bg-white/10'}`} />
              <span className={`text-[10px] font-black ${value === i ? 'text-black dark:text-white' : 'text-carbon-400'}`}>{i}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center border-t border-carbon-100 dark:border-white/5 pt-4">
        <div className="text-3xl font-black text-black dark:text-white italic tracking-tighter tabular-nums leading-none">
          {value} <span className="text-carbon-400 not-italic text-sm">/ {targetPoints}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-carbon-500 mt-2">{SCORE_LABELS[value as ScoreValue]}</span>
      </div>
    </div>
  )
}
