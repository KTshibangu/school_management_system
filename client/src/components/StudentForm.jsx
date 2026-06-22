import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'
import ClassroomSelect from './ClassroomSelect'

const StudentForm = ({ initialData, isAdmin, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const [classroom, setClassroom] = useState(initialData?.className || '')

    useEffect(() => {
        if (initialData) {
            setClassroom(initialData.className || '')
        }
    }, [initialData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // const formData = new FormData(e.target)
        // const data = {
        //     firstName: formData.get('firstName'),
        //     lastName: formData.get('lastName'),
        //     parentName: formData.get('parentName'),
        //     parentPhone: formData.get('parentPhone'),
        //     className: classroom,
        // }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>
            <div className='card p-5 sm:p-6'>
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>
                    Student
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div>
                        <label className='block mb-2'>First Name</label>
                        <input name='firstName' required defaultValue={initialData?.firstName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Last Name</label>
                        <input name='lastName' required defaultValue={initialData?.lastName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Parent Name</label>
                        <input name='parentName' required defaultValue={initialData?.parentName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Parent Phone No.</label>
                        <input name='parentPhone' required defaultValue={initialData?.parentPhone} />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Classroom</label>
                        <ClassroomSelect value={classroom} onChange={setClassroom} />
                        {!classroom && (
                            <p className='mt-2 text-xs text-slate-400'>No classroom selected yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                <button
                    onClick={() => (onCancel ? onCancel() : navigate(-1))}
                    type='button'
                    className='btn-secondary cursor-pointer'>
                    Cancel
                </button>
                {
                    isAdmin && (
                        <button
                            type='submit'
                            disabled={loading}
                            className='btn-primary flex items-center justify-center cursor-pointer'>
                            {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                            {isEditMode ? 'Update Student' : 'Create Student'}
                        </button>
                    )
                }
            </div>
        </form>
    )
}

export default StudentForm