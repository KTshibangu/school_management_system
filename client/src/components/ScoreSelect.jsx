import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const ScoreSelect = ({ label, options, value, onChange, placeholder = 'Select...' }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className='relative w-full' ref={ref}>
            {label && <label className='block text-sm text-slate-600 mb-1.5'>{label}</label>}
            <button
                type='button'
                onClick={() => setOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl border 
                bg-white transition-colors cursor-pointer
                ${open ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}
                ${value ? 'text-slate-800' : 'text-slate-400'}`}
            >
                {value || placeholder}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className='absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden'>
                    <ul className='max-h-60 overflow-y-auto py-1'>
                        <li
                            onClick={() => { onChange(''); setOpen(false) }}
                            className='flex items-center justify-between px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer'
                        >
                            {placeholder}
                            {!value && <Check className='w-4 h-4 text-indigo-500' />}
                        </li>
                        {options.map((opt) => {
                            const isSelected = value === opt
                            return (
                                <li
                                    key={opt}
                                    onClick={() => { onChange(opt); setOpen(false) }}
                                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                                    ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {opt}
                                    {isSelected && <Check className='w-4 h-4 text-indigo-500' />}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ScoreSelect