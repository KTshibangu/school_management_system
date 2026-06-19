import React, { useCallback } from 'react'
import { useState, useMemo, useEffect } from 'react'
import { dummyStudentData } from '../assets/myassets'
import { Plus, X } from 'lucide-react'
import StudentCard from '../components/StudentCard'
import StudentForm from '../components/StudentForm'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editStudents, setEditStudents] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setStudents(dummyStudentData)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  const gradeLevels = useMemo(() => {
    const unique = [...new Set(students.map((s) => s.gradeLevels))];
    return unique.sort((a, b) => a - b);
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (selectedGrade === 'ALL') return students;
    return students.filter((s) => s.gradeLevels === selectedGrade);
  }, [selectedGrade, students]);

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])


  return (
    <div className='animate-fade-in'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-tilte'>Students</h1>
          <p className='page-subtitle'>Add and edit Students</p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className='btn-primary flex items-center gap-2 w-full 
        sm:w-auto justify-center cursor-pointer'>
          <Plus size={16} /> Add Students
        </button>
      </div>

      {/* Filter Section */}
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setSelectedGrade('ALL')}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                        ${selectedGrade === 'ALL'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            All Grades
          </button>
          {gradeLevels.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                            ${selectedGrade === grade
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
            >
              Grade {grade}
            </button>
          ))}
        </div>

        {/* Filtered results */}
        {loading ? (
          <div className='flex justify-center p-12'>
            <div className='animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full' />
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className='text-sm text-slate-400'>No Students found for this grade.</p>
        ) : (
          <div className='card overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='table-modern'>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Parent's Name</th>
                    <th>Parent Phone</th>
                    <th>Class</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <StudentCard key={student._id} students={student} onDelete={fetchStudents} onEdit={setEditStudents} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Student Modal */}
        {
          showCreateModal && (
            <div onClick={() => setShowCreateModal(false)} className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start
          justify-center p-4 overflow-y-auto'>
              <div className='fixed inset-0' />
              <div onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl shadow-2xl 
            w-full max-w-3xl my-8 animate-fade-in'>
                <div className='flex items-center justify-between p-6 pb-0'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Add New Student</h2>
                    <p className='text-sm text-slate-500 mt-0.5'>Create a Student with details and class assigned</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className='p-2 rounded-lg hover:bg-slate-100 transition-colors
                text-slate-400 hover:text-slate-600'>
                    <X className='w-5 h-5' />
                  </button>
                </div>
                <div className='p-6'>
                  <StudentForm
                    onSuccess={() => {
                      setShowCreateModal(false)
                      fetchStudents()
                    }}
                    onCancel={() => setShowCreateModal(false)} />
                </div>
              </div>
            </div>
          )
        }

        {/* Edit Student Modal */}
        {
          editStudents && (
            <div onClick={() => setEditStudents(null)} className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start
          justify-center p-4 overflow-y-auto'>
              <div onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl shadow-2xl 
            w-full max-w-3xl my-8 animate-fade-in'>
                <div className='flex items-center justify-between p-6 pb-0'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Edit Student</h2>
                    <p className='text-sm text-slate-500 mt-0.5'>Update Student details</p>
                  </div>
                  <button onClick={() => setEditStudents(null)} className='p-2 rounded-lg hover:bg-slate-100 transition-colors
                text-slate-400 hover:text-slate-600'>
                    <X className='w-5 h-5' />
                  </button>
                </div>
                <div className='p-6'>
                  <StudentForm initialData={editStudents}
                    onSuccess={() => {
                      setEditStudents(null)
                      fetchStudents()
                    }}
                    onCancel={() => setEditStudents(null)} />
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Students