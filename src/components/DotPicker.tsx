import { useId } from "react"
import { cn } from "@/lib/utils"

/** Select one of a small set of values with clickable dots or arrow keys. */
export function DotPicker(
  /** Label, options, and current selection. */
  { label, options, value, onChange, suffix = "", className }: Props,
) {
  const name = useId()
  return (
    <div className={cn("dot-picker", className)}>
      <span>{label}</span>
      <div className="dot-options" role="radiogroup" aria-label={label}>
        {options.map(option => (
          <label className="dot-option" key={option} title={`${option}${suffix}`}>
            <input
              type="radio"
              name={name}
              aria-label={`${option}${suffix}`}
              value={option}
              checked={option === value}
              onChange={() => onChange(option)}
            />
          </label>
        ))}
      </div>
      <output>
        {value}
        {suffix}
      </output>
    </div>
  )
}

type Props = {
  /** Visible and accessible group label. */
  label: string
  /** Available discrete values, in ascending order. */
  options: readonly number[]
  /** Currently selected value. */
  value: number
  /** Apply a selection. */
  onChange: (value: number) => void
  /** Unit shown beside each value. */
  suffix?: string
  /** Layout class for the header. */
  className?: string
}
