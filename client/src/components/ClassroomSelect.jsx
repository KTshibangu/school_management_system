import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ClassroomSelect = ({ value, onChange, disabled, name = 'class' }) => {
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/classes')
      .then(({ data }) => setClasses(data.data || []))
      .catch((err) => {
        console.error('Failed to load classes:', err);
        toast.error('Could not load classes');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedClass = classes.find(c => c._id === value);

  return (
    <div className="relative w-full" ref={ref}>
      {/* native input so this value is picked up by FormData on submit */}
      <input type="hidden" name={name} value={value || ''} />

      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl border 
                bg-white transition-colors cursor-pointer
                ${open ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}
                ${selectedClass ? 'text-slate-800' : 'text-slate-400'}
                ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {loading
          ? 'Loading classes...'
          : selectedClass
            ? `${selectedClass.name} (${selectedClass.grade})`
            : 'Select...'}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer w-full"
              >
                Select...
                {!value && <Check className="w-4 h-4 text-indigo-500" />}
              </button>
            </li>
            {classes.map(classItem => {
              const isSelected = value === classItem._id;
              return (
                <li key={classItem._id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(classItem._id);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors w-full
                                        ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {`${classItem.name} (${classItem.grade})`}
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassroomSelect;