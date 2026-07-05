import React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { CLASSES } from '../assets/myassets';
import ClassCard from '../components/ClassCard';
import ClassForm from '../components/ClassForm';
import api from '../api/axios';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editClasses, setEditClasses] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  const fetchClasses = useCallback(async () => {
    try {
      const res = await api.get('/classes')
      setClasses(res.data.data)
    } catch (error) {
      console.error("Failed to fetch Classes")
      toast.error(error.response?.data?.error || error?.message)
    } finally {
      setLoading(false)
    }
  }, []);

  const gradeLevels = useMemo(() => {
    const unique = [...new Set(classes.map(s => s.grade))];
    return unique.sort((a, b) => a - b);
  }, [classes]);

  const filteredClasses = useMemo(() => {
    if (selectedGrade === 'ALL') return classes;
    return classes.filter(s => s.grade === selectedGrade);
  }, [selectedGrade, classes]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-tilte">Classes</h1>
          <p className="page-subtitle">Add and edit Classes</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 w-full 
        sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={16} /> Add Classes
        </button>
      </div>

      {/* Filter Section */}
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
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
          {gradeLevels.map(grade => (
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
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.length === 0 ? (
              <p className="text-sm text-slate-400 col-span-full">
                No subjects found for this grade.
              </p>
            ) : (
              filteredClasses.map(classItem => (
                <ClassCard
                  key={classItem._id}
                  classes={classItem}
                  onDelete={fetchClasses}
                  onEdit={setEditClasses}
                />
              ))
            )}
          </div>
        )}

        {/* Create Classes Modal */}
        {showCreateModal && (
          <div
            onClick={() => setShowCreateModal(false)}
            className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start
          justify-center p-4 overflow-y-auto"
          >
            <div className="fixed inset-0" />
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl 
            w-full max-w-3xl my-8 animate-fade-in"
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Add New Class
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Create a Class with grade level and allocated subjects
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors
                text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <ClassForm
                  onSuccess={() => {
                    setShowCreateModal(false);
                    fetchClasses();
                  }}
                  onCancel={() => setShowCreateModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Classes Modal */}
        {editClasses && (
          <div
            onClick={() => setEditClasses(null)}
            className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start
          justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl 
            w-full max-w-3xl my-8 animate-fade-in"
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Edit Class
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Update Class details
                  </p>
                </div>
                <button
                  onClick={() => setEditClasses(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors
                text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <ClassForm
                  initialData={editClasses}
                  onSuccess={() => {
                    setEditClasses(null);
                    fetchClasses();
                  }}
                  onCancel={() => setEditClasses(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
