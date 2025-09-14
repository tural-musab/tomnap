"use client"

import { useState } from 'react'

interface ControlSwitchProps {
  initial?: boolean
  onChange?: (value: boolean) => void
}

export default function ControlSwitch({ initial = false, onChange }: ControlSwitchProps) {
  const [on, setOn] = useState<boolean>(initial)
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        const v = !on
        setOn(v)
        onChange?.(v)
      }}
      className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${
        on ? 'bg-green-500' : 'bg-white/20'
      }`}
    >
      <span
        className={`absolute left-1 top-1 inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
          on ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )
}


