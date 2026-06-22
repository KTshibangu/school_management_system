import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';

const SubjectForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const handleSubmit = async e => {
    e.preventDefault();
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
              name="gradeLevels"
              required
              defaultValue={initialData?.gradeLevels}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 1 Chapters</label>
            <textarea
              name="term1Chapters"
              rows={3}
              defaultValue={initialData?.term1Chapters}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 2 Chapters</label>
            <textarea
              name="term2Chapters"
              rows={3}
              defaultValue={initialData?.term2Chapters}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 3 Chapters</label>
            <textarea
              name="term3Chapters"
              rows={3}
              defaultValue={initialData?.term3Chapters}
              className="resize-none"
              placeholder="List Chapters (comma separated)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Term 4 Chapters</label>
            <textarea
              name="term4Chapters"
              rows={3}
              defaultValue={initialData?.term4Chapters}
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
