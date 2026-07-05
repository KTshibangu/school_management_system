import React, { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast'

const TeacherForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;
  const [selectedClasses, setSelectedClasses] = useState(() =>
    normaliseClassIds(initialData?.classesAssigned)
  );

  function normaliseClassIds(classesAssigned) {
    if (!classesAssigned) return [];
    return classesAssigned.map(c => (typeof c === 'string' ? c : c._id));
  }

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true)
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    api.get('/classes')
      .then(({ data }) => {
        setClasses(data.data || [])
      })
      .catch((err) => {
        console.error('Failed to load classes:', err);
        toast.error('Could not load classes');
      })
      .finally(() => setClassesLoading(false));

    api.get('/subjects')
      .then(({ data }) => setSubjects(data.data || []))
      .catch((err) => {
        console.error('Failed to load subjects:', err);
        toast.error('Could not load subjects');
      })
      .finally(() => setSubjectsLoading(false));
  }, [])

  const toggleClass = classId => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(c => c !== classId)
        : [...prev, classId]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (isEditMode) {
      const pwd = formData.get('password')
      if (!pwd) formData.delete('password')
    }

    try {
      const url = isEditMode ? `/teachers/${initialData.id}` : '/teachers';
      const method = isEditMode ? "put" : "post";
      await api[method](url, formData)
      onSuccess ? onSuccess() : navigate("/teachers")
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (initialData?.classesAssigned) {
      setSelectedClasses(normaliseClassIds(initialData.classesAssigned));
    }
  }, [initialData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* Personal Information */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              name="firstName"
              required
              defaultValue={initialData?.firstName}
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              name="lastName"
              required
              defaultValue={initialData?.lastName}
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input name="phone" required defaultValue={initialData?.phone} />
          </div>
          <div>
            <label className="block mb-2">Subject</label>
            <select name="subject" defaultValue={initialData?.subject}>
              <option value="">
                {subjectsLoading ? 'Loading subjects...' : 'Select Subject'}
              </option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">employeeCode</label>
            <input
              name="employeeCode"
              required
              defaultValue={initialData?.employeeCode}
            />
          </div>
          <div>
            <label className="block mb-2">Join Date</label>
            <input
              type="date"
              name="joinDate"
              required
              defaultValue={
                initialData?.joinDate
                  ? new Date(initialData.joinDate).toISOString().split('T')[0]
                  : ''
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Bio (Optional)</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={initialData?.bio}
              className="resize-none"
              placeholder="Brief Description..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm text-slate-700">
              Classes Assigned
            </label>
            <div className="flex flex-wrap gap-2">
              {
                classesLoading && (
                  <p className='text-xs text-slate-400'>Loading classes...</p>
                )
              }
              {!classesLoading && classes.map(cl => {
                const isSelected = selectedClasses.includes(cl._id);
                return (
                  <label
                    key={cl._id}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border 
                                    cursor-pointer transition-colors select-none ${isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={cl._id}
                      checked={isSelected}
                      onChange={() => toggleClass(cl._id)}
                      className="sr-only"
                    />
                    {cl.name}
                  </label>
                );
              })}
            </div>
            {selectedClasses.length === 0 && !classesLoading && (
              <p className="mt-2 text-xs text-slate-400">
                No classes selected yet
              </p>
            )}
            <input
              type="hidden"
              name="classesAssigned"
              value={selectedClasses.join(',')}
            />
          </div>

          {isEditMode && (
            <div>
              <label className="block mb-2">Status</label>
              <select
                name="employmentStatus"
                defaultValue={initialData?.employmentStatus}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Account Setup */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="sm:col-span-2">School Email</label>
            <input
              type="email"
              name="email"
              required
              defaultValue={initialData?.email}
            />
          </div>
          {!isEditMode && (
            <div>
              <label className="block mb-2">Temporary Password</label>
              <input type="password" name="password" required />
            </div>
          )}
          {isEditMode && (
            <div>
              <label className="block mb-2">Change Password(Optional)</label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
              />
            </div>
          )}
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
          {isEditMode ? 'Update Teacher' : 'Create Teacher'}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
