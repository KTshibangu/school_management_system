import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS, CLASSES } from '../assets/myassets'
import { Loader2Icon } from 'lucide-react'


const TeacherForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData
    const [selectedClasses, setSelectedClasses] = useState(initialData?.classesAssigned || []);

    const toggleClass = (className) => {
        setSelectedClasses((prev) =>
            prev.includes(className)
                ? prev.filter((c) => c !== className)
                : [...prev, className]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (initialData?.classesAssigned) {
            setSelectedClasses(initialData.classesAssigned);
        }
    }, [initialData]);

    return (
        <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>
            {/* Personal Information */}
            <div className='card p-5 sm:p-6'>
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>
                    Personal Information
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
                        <label className='block mb-2'>Phone Number</label>
                        <input name='phone' required defaultValue={initialData?.phone} />
                    </div>
                    <div>
                        <label className='block mb-2'>Subject</label>
                        <select name="subject" defaultValue={initialData?.subject}>
                            <option value="">Select Subject</option>
                            {SUBJECTS.map((subject) => (
                                <option key={subject.code} value={subject.name}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block mb-2'>employeeCode</label>
                        <input name='employeeCode' required defaultValue={initialData?.employeeCode} />
                    </div>
                    <div>
                        <label className='block mb-2'>Join Date</label>
                        <input type='date' name='joinDate' required defaultValue={initialData?.joinDate ?
                            new Date(initialData.joinDate).toISOString().split("T")[0] : ""} />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Bio (Optional)</label>
                        <textarea name='bio' rows={3} defaultValue={initialData?.bio} className='resize-none'
                            placeholder='Brief Description...' />
                    </div>

                    <div className='sm:col-span-2'>
                        <label className='block mb-2 text-sm text-slate-700'>Classes Assigned</label>
                        <div className='flex flex-wrap gap-2'>
                            {CLASSES.map((cl) => {
                                const isSelected = selectedClasses.includes(cl.name);
                                return (
                                    <label key={cl.name} className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border 
                                    cursor-pointer transition-colors select-none ${isSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                        <input type='checkbox' name='classesAssigned' value={cl.name} checked={isSelected}
                                            onChange={() => toggleClass(cl.name)} className='sr-only' />
                                        {cl.name}
                                    </label>
                                );
                            })}
                        </div>
                        {selectedClasses.length === 0 && (
                            <p className='mt-2 text-xs text-slate-400'>No classes selected yet</p>
                        )}
                        <input type='hidden' name='classesAssigned' value={selectedClasses.join(',')} />
                    </div>

                    {
                        isEditMode && (
                            <div>
                                <label className='block mb-2'>Status</label>
                                <select name="employmentStatus" defaultValue={initialData?.employmentStatus}>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Account Setup */}
            <div className='card p-5 sm:p-6'>
                <h3 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>
                    Personal Information
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div>
                        <label className='sm:col-span-2'>School Email</label>
                        <input type='email' name='email' required defaultValue={initialData?.email} />
                    </div>
                    {
                        !isEditMode && (
                            <div>
                                <label className='block mb-2'>Temporary Password</label>
                                <input type="password" name='password' required />
                            </div>
                        )
                    }
                    {
                        isEditMode && (
                            <div>
                                <label className='block mb-2'>Change Password(Optional)</label>
                                <input type="password" name='password' placeholder='Leave blank to keep current password' />
                            </div>
                        )
                    }
                </div>
            </div>

            {/* buttons */}
            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                <button onClick={() => (onCancel ? onCancel() : navigate(-1))} type='button'
                    className='btn-secondary cursor-pointer'>
                    Cancel
                </button>
                <button type='submit' disabled={loading} className='btn-primary flex items-center 
                justify-center cursor-pointer'>
                    {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                    {isEditMode ? "Update Teacher" : "Create Teacher"}
                </button>
            </div>

        </form>
    )
}

export default TeacherForm
