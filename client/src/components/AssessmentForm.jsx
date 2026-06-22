import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'
import { CLASSES, TERMS, ASSESSMENT_TYPES } from '../assets/myassets'
import AssessmentSelect from './AssessmentSelect'


const AssessmentForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const [type, setType] = useState(initialData?.assessmentType || '')
    const [term, setTerm] = useState(initialData?.term || '')
    const [classes, setClasses] = useState(initialData?.className || '')

    const classNames = [...new Set(CLASSES.map((s) => s.name))]

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-5 animate-fade-in'>
            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Title</label>
                <input name='title' required defaultValue={initialData?.title}
                    placeholder='e.g. Term 1 Mathematics Test' />
            </div>

            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Description</label>
                <textarea name='description' rows={4} defaultValue={initialData?.description}
                    className='resize-none' placeholder='Brief description of the assessment...' />
            </div>

            <AssessmentSelect
                label='Type'
                options={ASSESSMENT_TYPES}
                value={type}
                onChange={setType}
                placeholder='Select...'
            />

            <AssessmentSelect
                label='Term'
                options={TERMS}
                value={term}
                onChange={setTerm}
                placeholder='Select...'
            />

            <AssessmentSelect
                label='Class'
                options={classNames}
                value={classes}
                onChange={setClasses}
                placeholder='Select...'
            />

            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Due Date</label>
                <input type='datetime-local' name='dueDate' required
                    defaultValue={initialData?.dueDate.slice(0, 16)} />
            </div>

            <div>
                <label className='block text-sm text-slate-600 mb-1.5'>Max Score</label>
                <input type='number' name='maxScore' required min={1}
                    defaultValue={initialData?.totalMarks} placeholder='e.g. 100' />
            </div>

            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                <button type='button' onClick={() => (onCancel ? onCancel() : navigate(-1))}
                    className='btn-secondary cursor-pointer'>
                    Cancel
                </button>
                <button type='submit' disabled={loading}
                    className='btn-primary flex items-center justify-center cursor-pointer'>
                    {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                    {isEditMode ? 'Update Assessment' : 'Create Assessment'}
                </button>
            </div>
        </form>
    )
}

export default AssessmentForm