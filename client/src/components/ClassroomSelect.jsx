import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon, ChevronDown, Check } from 'lucide-react';
import { CLASSES } from '../assets/myassets';

const ClassroomSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedClass = CLASSES.find(c => c.name === value);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl border 
                bg-white transition-colors cursor-pointer
                ${open ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}
                ${selectedClass ? 'text-slate-800' : 'text-slate-400'}`}
      >
        {selectedClass
          ? `${selectedClass.name} (${selectedClass.gradeLevels})`
          : 'Select...'}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer"
              >
                Select...
                {!value && <Check className="w-4 h-4 text-indigo-500" />}
              </button>
            </li>
            {CLASSES.map(classItem => {
              const isSelected = value === classItem.name;
              return (
                <li key={classItem.name}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(classItem.name);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                                        ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {`${classItem.name} (${classItem.gradeLevels})`}
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
