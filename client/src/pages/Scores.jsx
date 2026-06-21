import { useState, useCallback, useEffect, useMemo } from 'react'
import { Plus, X } from 'lucide-react'
import { dummyGradeData, CLASSES, TERMS, dummyStudentData } from '../assets/myassets'
import { getGradeDisplay } from '../assets/myassets'
import ScoreForm from '../components/ScoreForm'
import ScoreSelect from '../components/ScoreSelect'

const gradeNumbers = [...new Set(CLASSES.map((c) => String(c.gradeLevels)))].sort()
const classNames = CLASSES.map((c) => c.name)
const studentNames = dummyStudentData.map((s) => `${s.firstName} ${s.lastName}`)

const Scores = () => {
    const [grades, setGrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const [filterGrade, setFilterGrade] = useState('')
    const [filterClass, setFilterClass] = useState('')
    const [filterTerm, setFilterTerm] = useState('')
    const [filterStudent, setFilterStudent] = useState('')

    const fetchGrades = useCallback(async () => {
        setLoading(true)
        setTimeout(() => {
            setGrades(dummyGradeData)
            setLoading(false)
        }, 1000)
    }, [])

    useEffect(() => { fetchGrades() }, [fetchGrades])

    
    useEffect(() => { setFilterClass('') }, [filterGrade])

    const filteredClassOptions = CLASSES
        .filter((c) => !filterGrade || String(c.gradeLevels) === filterGrade)
        .map((c) => c.name)

    const filteredGrades = useMemo(() => {
        return grades.filter((g) => {
            const studentName = g.student
                ? `${g.student.firstName} ${g.student.lastName}`
                : ''
            const matchGrade = !filterGrade || g.student?.grade === `Grade ${filterGrade}`
            const matchClass = !filterClass || g.student?.className === filterClass
            const matchTerm = !filterTerm || g.term === filterTerm
            const matchStudent = !filterStudent || studentName === filterStudent
            return matchGrade && matchClass && matchTerm && matchStudent
        })
    }, [grades, filterGrade, filterClass, filterTerm, filterStudent])

    const modalShell = (title, subtitle, content, onClose) => (
        <div onClick={onClose} className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex 
        items-start justify-center p-4 overflow-y-auto'>
            <div onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl 
            shadow-2xl w-full max-w-lg my-8 animate-fade-in'>
                <div className='flex items-center justify-between p-6 pb-0'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
                        <p className='text-sm text-slate-500 mt-0.5'>{subtitle}</p>
                    </div>
                    <button onClick={onClose} className='p-2 rounded-lg hover:bg-slate-100 
                    transition-colors text-slate-400 hover:text-slate-600'>
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
                    <h1 className='page-tilte'>Scores</h1>
                    <p className='page-subtitle'>Capture and track student grades</p>
                </div>
                <button onClick={() => setShowCreateModal(true)}
                    className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer'>
                    <Plus size={16} /> Capture Grade
                </button>
            </div>

            {/* Filters */}
            <div className='card p-5 mb-5'>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    <ScoreSelect
                        label='Filter by Class'
                        options={filteredClassOptions}
                        value={filterClass}
                        onChange={setFilterClass}
                        placeholder='All classes'
                    />
                    <ScoreSelect
                        label='Filter by Term'
                        options={TERMS}
                        value={filterTerm}
                        onChange={setFilterTerm}
                        placeholder='All terms'
                    />
                    <ScoreSelect
                        label='Filter by Student'
                        options={studentNames}
                        value={filterStudent}
                        onChange={setFilterStudent}
                        placeholder='All students'
                    />
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
                                    <th>Assessment</th>
                                    <th>Student</th>
                                    <th>Term</th>
                                    <th>Class</th>
                                    <th>Score</th>
                                    <th>Percent</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrades.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className='text-center text-slate-400 py-10'>
                                            No grades found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredGrades.map((g) => {
                                        const { grade, className: badgeClass } = getGradeDisplay(g.percentage)
                                        return (
                                            <tr key={g._id}>
                                                <td className='font-medium text-slate-800'>
                                                    {g.assessmentType}
                                                </td>
                                                <td>
                                                    {g.student
                                                        ? `${g.student.firstName} ${g.student.lastName}`
                                                        : '—'}
                                                </td>
                                                <td>{g.term}</td>
                                                <td>
                                                    {g.student?.className || '—'}
                                                </td>
                                                <td>{g.marksObtained} / {g.totalMarks}</td>
                                                <td>{g.percentage}%</td>
                                                <td>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs border ${badgeClass}`}>
                                                        {grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && modalShell(
                'Capture Grade',
                'Record a student grade for an assessment',
                <ScoreForm
                    onSuccess={() => { setShowCreateModal(false); fetchGrades() }}
                    onCancel={() => setShowCreateModal(false)}
                />,
                () => setShowCreateModal(false)
            )}
        </div>
    )
}

export default Scores
