import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'
import { CLASSES, dummyStudentData, dummyAssignmentData } from '../assets/myassets'
import ScoreSelect from './ScoreSelect'

const ScoreForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const [selectedGrade, setSelectedGrade] = useState('')
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedAssessment, setSelectedAssessment] = useState('')
    const [selectedStudent, setSelectedStudent] = useState('')
    const [score, setScore] = useState('')
    const [maxScore, setMaxScore] = useState('')
    const [remarks, setRemarks] = useState('')


    const isInitializing = useRef(false)

    const gradeOptions = [...new Set(CLASSES.map((c) => String(c.gradeLevels)))].sort()

    const classOptions = CLASSES
        .filter((c) => !selectedGrade || String(c.gradeLevels) === selectedGrade)
        .map((c) => c.name)

    const studentOptions = dummyStudentData
        .filter((s) => !selectedClass || s.className === selectedClass)
        .map((s) => `${s.firstName} ${s.lastName}`)

    const assessmentOptions = dummyAssignmentData
        .filter((a) => !selectedClass || a.className === selectedClass)
        .map((a) => a.title)

    useEffect(() => {
        if (!initialData) return
        isInitializing.current = true

        const gradeNum = initialData.student?.grade?.replace('Grade ', '').trim() || ''
        const className = initialData.student?.className || ''
        const studentName = initialData.student
            ? `${initialData.student.firstName} ${initialData.student.lastName}`
            : ''

        setSelectedGrade(gradeNum)
        setSelectedClass(className)
        setSelectedAssessment(initialData.assessmentType || '')
        setSelectedStudent(studentName)
        setScore(String(initialData.marksObtained ?? ''))
        setMaxScore(String(initialData.totalMarks ?? ''))
        setRemarks(initialData.remarks || '')


        setTimeout(() => { isInitializing.current = false }, 0)
    }, [initialData])

    useEffect(() => {
        if (isInitializing.current) return
        setSelectedClass('')
        setSelectedAssessment('')
        setSelectedStudent('')
    }, [selectedGrade])

    useEffect(() => {
        if (isInitializing.current) return
        setSelectedAssessment('')
        setSelectedStudent('')
    }, [selectedClass])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            grade: selectedGrade,
            className: selectedClass,
            assessment: selectedAssessment,
            student: selectedStudent,
            score,
            maxScore,
            remarks,
        }
        console.log(data) // replace with API call
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-5 animate-fade-in'>
            <ScoreSelect
                label='Grade'
                options={gradeOptions}
                value={selectedGrade}
                onChange={setSelectedGrade}
                placeholder='Select grade...'
            />
            <ScoreSelect
                label='Class'
                options={classOptions}
                value={selectedClass}
                onChange={setSelectedClass}
                placeholder={selectedGrade ? 'Select class...' : 'Select a grade first'}
            />
            <ScoreSelect
                label='Assessment'
                options={assessmentOptions}
                value={selectedAssessment}
                onChange={setSelectedAssessment}
                placeholder={selectedClass ? 'Select assessment...' : 'Select a class first'}
            />
            <ScoreSelect
                label='Student'
                options={studentOptions}
                value={selectedStudent}
                onChange={setSelectedStudent}
                placeholder={selectedClass ? 'Select student...' : 'Select a class first'}
            />

            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Score</label>
                <input
                    type='number' min={0} required
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder='e.g. 78'
                />
            </div>

            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Max Score</label>
                <input
                    type='number' min={1} required
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    placeholder='e.g. 100'
                />
            </div>

            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Remarks</label>
                <textarea
                    rows={4} className='resize-none'
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder='Optional remarks about this grade...'
                />
            </div>

            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                <button type='button' onClick={() => (onCancel ? onCancel() : navigate(-1))}
                    className='btn-secondary cursor-pointer'>
                    Cancel
                </button>
                <button type='submit' disabled={loading}
                    className='btn-primary flex items-center justify-center cursor-pointer'>
                    {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                    {isEditMode ? 'Update Grade' : 'Capture Grade'}
                </button>
            </div>
        </form>
    )
}

export default ScoreForm