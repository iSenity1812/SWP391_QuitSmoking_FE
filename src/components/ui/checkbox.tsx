import { Check } from "lucide-react"

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  className?: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, className = "", disabled = false }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center w-4 h-4 border-2 rounded transition-all duration-200
        ${checked 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'bg-white border-slate-300 hover:border-slate-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${className}
      `}
    >
      {checked && <Check className="w-3 h-3" />}
    </button>
  )
}
