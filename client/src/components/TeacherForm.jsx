import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../assets/myassets'
import { Loader2Icon } from 'lucide-react'


const TeacherForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const handleSubmit = async (e) => {
        e.preventDefault()
    }
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
                                <option key={subject} value={subject}>
                                    {subject}
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
