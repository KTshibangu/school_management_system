import React from 'react'
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';

const StudentCard = ({ students, isAdmin, onDelete, onEdit }) => {
    const handleDelete = async () => {
        if (!confirm("Are you want to delete this class"))
            return;
    }

    return (
        <>
            <tr key={students._id}>
                <td>{students.firstName}</td>
                <td>{students.lastName}</td>
                <td>{students.parentName || '—'}</td>
                <td>{students.parentPhone}</td>
                <td>{students.className}</td>
                <td>
                    <div className='flex items-center gap-2'>
                        <button onClick={() => onEdit(students)} className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 
                        hover:text-indigo-600 rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer'>
                            {
                                isAdmin ? <PencilIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4'/>
                            }
                        </button>

                        {
                            isAdmin && (
                                <button onClick={handleDelete} className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 rounded-xl
                        shadow-lg transition-all hover:scale-105 disabled:opacity-50'>
                                    <Trash2Icon className='w-4 h-4' />
                                </button>
                            )
                        }
                    </div>
                </td>
            </tr>
        </>
    )
}

export default StudentCard
