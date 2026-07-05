import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ClassForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const isEditMode = !!initialData;

  const [gradeLevel, setGradeLevel] = useState(initialData?.grade || '');
  const [selectedSubjects, setSelectedSubjects] = useState(
    normaliseSubjectIds(initialData?.classSubjects)
  );

  function normaliseSubjectIds(classSubjects) {
    if (!classSubjects) return [];
    return classSubjects.map(s => (typeof s === 'string' ? s : s._id));
  }

  useEffect(() => {
    api.get('/subjects')
      .then(({ data }) => setSubjects(data.data || []))
      .catch((err) => {
        console.error('Failed to load subjects:', err);
        toast.error('Could not load subjects');
      })
  }, [])

  useEffect(() => {
    if (initialData) {
      setGradeLevel(initialData.grade || '');
      setSelectedSubjects(normaliseSubjectIds(initialData.classSubjects));
    }
  }, [initialData]);

  const availableSubjects = subjects.filter(
    s => String(s.grade) === String(gradeLevel)
  );

  const toggleSubject = subjectId => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId) ? prev.filter(c => c !== subjectId) : [...prev, subjectId]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const url = isEditMode ? `/classes/${initialData._id}` : '/classes';
      const method = isEditMode ? "put" : "post";
      await api[method](url, formData)
      onSuccess ? onSuccess() : navigate("/classes")
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Class
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2">Name</label>
            <input name="name" required defaultValue={initialData?.name} />
          </div>
          <div>
            <label className="block mb-2">Grade Level</label>
            <input
              name="grade"
              required
              value={gradeLevel}
              onChange={e => setGradeLevel(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Subjects Allocated</label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map(subject => {
                const isSelected = selectedSubjects.includes(subject._id);
                return (
                  <label
                    key={subject._id}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border 
                                        cursor-pointer transition-colors select-none ${isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={subject._id}
                      checked={isSelected}
                      onChange={() => toggleSubject(subject._id)}
                      className="sr-only"
                    />
                    {subject.name}
                  </label>
                );
              })}
            </div>
            {availableSubjects.length === 0 && (
              <p className="mt-2 text-xs text-slate-400">
                Enter a grade level to see available subjects
              </p>
            )}
            <input
              type="hidden"
              name="classSubjects"
              value={selectedSubjects.join(',')}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          onClick={() => (onCancel ? onCancel() : navigate(-1))}
          type="button"
          className="btn-secondary cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center 
                justify-center cursor-pointer"
        >
          {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
          {isEditMode ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
