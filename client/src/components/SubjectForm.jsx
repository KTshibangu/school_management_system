import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SubjectForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const url = isEditMode ? `/subjects/${initialData._id}` : '/subjects';
      const method = isEditMode ? "put" : "post";
      await api[method](url, formData)
      onSuccess ? onSuccess() : navigate("/subjects")
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
          Subject
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2">Name</label>
            <input name="name" required defaultValue={initialData?.name} />
          </div>
          <div>
            <label className="block mb-2">Code</label>
            <input name="code" required defaultValue={initialData?.code} />
          </div>
          <div>
            <label className="block mb-2">Grade Level</label>
            <input
              name="grade"
              required
              defaultValue={initialData?.grade}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 1 Chapters</label>
            <textarea
              name="term1"
              rows={3}
              defaultValue={initialData?.term1}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 2 Chapters</label>
            <textarea
              name="term2"
              rows={3}
              defaultValue={initialData?.term2}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 3 Chapters</label>
            <textarea
              name="term3"
              rows={3}
              defaultValue={initialData?.term3}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 4 Chapters</label>
            <textarea
              name="term4"
              rows={3}
              defaultValue={initialData?.term4}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
        </div>
      </div>

      {/* buttons */}
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
          {isEditMode ? 'Update Subject' : 'Create Subject'}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
