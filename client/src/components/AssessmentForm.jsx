import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { SCHOOL_TERMS, ASSESSMENT_TYPES } from '../constants/AssessmentConstant';
import AssessmentSelect from './AssessmentSelect';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AssessmentForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const [type, setType] = useState(initialData?.type || '');
  const [term, setTerm] = useState(initialData?.term || '');
  const [classId, setClassId] = useState(
    initialData?.class?._id || initialData?.class || ''
  );

  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  useEffect(() => {
    api.get('/classes')
      .then(({ data }) => setClasses(data.data || []))
      .catch((err) => {
        console.error('Failed to load classes:', err);
        toast.error('Could not load classes');
      })
      .finally(() => setClassesLoading(false));
  }, []);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || '');
      setTerm(initialData.term || '');
      setClassId(initialData.class?._id || initialData.class || '');
    }
  }, [initialData]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.type = type;
    payload.term = term;
    payload.class = classId;

    try {
      const url = isEditMode ? `/assessments/${initialData._id}` : '/assessments';
      const method = isEditMode ? 'put' : 'post';
      await api[method](url, payload);
      onSuccess ? onSuccess() : navigate('/assessments');
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Title</label>
        <input
          name="title"
          required
          defaultValue={initialData?.title}
          placeholder="e.g. Term 1 Mathematics Test"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description}
          className="resize-none"
          placeholder="Brief description of the assessment..."
        />
      </div>

      <AssessmentSelect
        label="Type"
        options={ASSESSMENT_TYPES}
        value={type}
        onChange={setType}
        placeholder="Select..."
      />

      <AssessmentSelect
        label="Term"
        options={SCHOOL_TERMS}
        value={term}
        onChange={setTerm}
        placeholder="Select..."
      />

      <AssessmentSelect
        label="Class"
        options={classes.map(cl => ({ label: cl.name, value: cl._id }))}
        value={classId}
        onChange={setClassId}
        placeholder={classesLoading ? 'Loading classes...' : 'Select...'}
      />

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          required
          defaultValue={initialData?.dueDate ? initialData.dueDate.slice(0, 16) : ''}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Max Score</label>
        <input
          type="number"
          name="maxScore"
          required
          min={1}
          defaultValue={initialData?.maxScore}
          placeholder="e.g. 100"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          className="btn-secondary cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center cursor-pointer"
        >
          {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          {isEditMode ? 'Update Assessment' : 'Create Assessment'}
        </button>
      </div>
    </form>
  );
};

export default AssessmentForm;