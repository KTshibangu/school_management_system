import { useState, useCallback, useEffect, useMemo } from 'react'
import { Plus, X, PencilIcon, Trash2Icon } from 'lucide-react'
import { dummyAssignmentData, CLASSES, TERMS, ASSESSMENT_TYPES } from '../assets/myassets'
import AssessmentForm from '../components/AssessmentForm'
import AssessmentSelect from '../components/AssessmentSelect'

const classNames = [...new Set(CLASSES.map((s) => s.name))]

const Assessments = () => {
    const [assessments, setAssessments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editAssessment, setEditAssessment] = useState(null)

    const [filterType, setFilterType] = useState('')
    const [filterTerm, setFilterTerm] = useState('')
    const [filterClass, setFilterClass] = useState('')

    const fetchAssessments = useCallback(async () => {
        setLoading(true)
        setTimeout(() => {
            setAssessments(dummyAssignmentData)
            setLoading(false)
        }, 1000)
    }, [])

    const handleDelete = async () => {
        if (!confirm("Are you want to delete this subject"))
            return;
    }

    useEffect(() => { fetchAssessments() }, [fetchAssessments])

    const filteredAssessments = useMemo(() => {
        return assessments.filter((a) => {
            const matchType = !filterType || a.assessmentType === filterType.toUpperCase()
            const matchTerm = !filterTerm || a.term === filterTerm
            const matchClass = !filterClass || a.className === filterClass
            return matchType && matchTerm && matchClass
        })
    }, [assessments, filterType, filterTerm, filterClass])

    const modalShell = (title, subtitle, content, onClose) => (
        <div onClick={onClose} className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start
        justify-center p-4 overflow-y-auto'>
            <div onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl shadow-2xl 
            w-full max-w-lg my-8 animate-fade-in'>
                <div className='flex items-center justify-between p-6 pb-0'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
                        <p className='text-sm text-slate-500 mt-0.5'>{subtitle}</p>
                    </div>
                    <button onClick={onClose} className='p-2 rounded-lg hover:bg-slate-100 transition-colors
                    text-slate-400 hover:text-slate-600'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                <div className='p-6'>{content}</div>
            </div>
        </div>
    )

    return (
        <div className='animate-fade-in'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className='page-title'>Assessments</h1>
                    <p className='page-subtitle'>Manage and track assessments</p>
                </div>
                <button onClick={() => setShowCreateModal(true)}
                    className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer'>
                    <Plus size={16} /> Add Assessment
                </button>
            </div>

            {/* Filters */}
            <div className='card p-5 mb-5'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <AssessmentSelect label='Filter by Type' options={ASSESSMENT_TYPES}
                        value={filterType} onChange={setFilterType} placeholder='All' />
                    <AssessmentSelect label='Filter by Term' options={TERMS}
                        value={filterTerm} onChange={setFilterTerm} placeholder='All' />
                    <AssessmentSelect label='Filter by Class' options={classNames}
                        value={filterClass} onChange={setFilterClass} placeholder='All' />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className='flex justify-center p-12'>
                    <div className='animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full' />
                </div>
            ) : (
                <div className='card overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='table-modern'>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Class</th>
                                    <th>Term</th>
                                    <th>Type</th>
                                    <th>Max Score</th>
                                    <th>Due</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssessments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className='text-center text-slate-400 py-10'>
                                            No assessments found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssessments.map((a) => (
                                        <tr key={a._id}>
                                            <td className='font-medium text-slate-800'>{a.title}</td>
                                            <td>{a.className}</td>
                                            <td>{a.term}</td>
                                            <td>
                                                <span className='px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-100'>
                                                    {a.assessmentType}
                                                </span>
                                            </td>
                                            <td>{a.totalMarks}</td>
                                            <td>{new Date(a.dueDate).toLocaleDateString('en-ZA', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}</td>
                                            <td className='flex items-center gap-2'>
                                                <button onClick={() => setEditAssessment(a)}
                                                    className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-indigo-600 rounded-xl 
                                                    shadow-lg transition-all hover:scale-105 cursor-pointer'>
                                                    <PencilIcon className='w-4 h-4' />
                                                </button>

                                                <button onClick={handleDelete} className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 
                                                rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50'>
                                                    <Trash2Icon className='w-4 h-4' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && modalShell(
                'Add New Assessment',
                'Create an assessment with type, term and subject',
                <AssessmentForm
                    onSuccess={() => { setShowCreateModal(false); fetchAssessments() }}
                    onCancel={() => setShowCreateModal(false)}
                />,
                () => setShowCreateModal(false)
            )}

            {/* Edit Modal */}
            {editAssessment && modalShell(
                'Edit Assessment',
                'Update assessment details',
                <AssessmentForm
                    initialData={editAssessment}
                    onSuccess={() => { setEditAssessment(null); fetchAssessments() }}
                    onCancel={() => setEditAssessment(null)}
                />,
                () => setEditAssessment(null)
            )}
        </div>
    )
}

export default Assessments
