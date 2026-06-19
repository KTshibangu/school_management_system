import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../assets/myassets'
import { Loader2Icon } from 'lucide-react'

const ClassForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const [gradeLevel, setGradeLevel] = useState(initialData?.gradeLevels || '')
    const [selectedSubjects, setSelectedSubjects] = useState(
        initialData?.subjectsAllocated || []
    )

    useEffect(() => {
        if (initialData) {
            setGradeLevel(initialData.gradeLevels || '')
            setSelectedSubjects(initialData.subjectsAllocated || [])
        }
    }, [initialData])

    const availableSubjects = SUBJECTS.filter(
        (s) => String(s.gradeLevels) === String(gradeLevel)
    )

    const toggleSubject = (code) => {
        setSelectedSubjects((prev) =>
            prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>
            <div className='card p-5 sm:p-6'>
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>
                    Class
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div>
                        <label className='block mb-2'>Name</label>
                        <input name='name' required defaultValue={initialData?.name} />
                    </div>
                    <div>
                        <label className='block mb-2'>Grade Level</label>
                        <input
                            name='gradeLevels'
                            required
                            value={gradeLevel}
                            onChange={(e) => setGradeLevel(e.target.value)}
                        />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Subjects Allocated</label>
                        <div className='flex flex-wrap gap-2'>
                            {availableSubjects.map((subject) => {
                                const isSelected = selectedSubjects.includes(subject.code)
                                return (
                                    <label
                                        key={subject.code}
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border 
                                        cursor-pointer transition-colors select-none ${isSelected
                                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                    >
                                        <input
                                            type='checkbox'
                                            name='subjectsAllocated'
                                            value={subject.code}
                                            checked={isSelected}
                                            onChange={() => toggleSubject(subject.code)}
                                            className='sr-only'
                                        />
                                        {subject.name}
                                    </label>
                                )
                            })}
                        </div>
                        {availableSubjects.length === 0 && (
                            <p className='mt-2 text-xs text-slate-400'>
                                Enter a grade level to see available subjects
                            </p>
                        )}
                        <input type='hidden' name='subjectsAllocated' value={selectedSubjects.join(',')} />
                    </div>
                </div>
            </div>

            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                <button onClick={() => (onCancel ? onCancel() : navigate(-1))} type='button'
                    className='btn-secondary cursor-pointer'>
                    Cancel
                </button>
                <button type='submit' disabled={loading} className='btn-primary flex items-center 
                justify-center cursor-pointer'>
                    {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                    {isEditMode ? "Update Class" : "Create Class"}
                </button>
            </div>
        </form>
    )
}

export default ClassForm
