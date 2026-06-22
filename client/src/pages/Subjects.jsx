import React, { useCallback } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { SUBJECTS } from '../assets/myassets';
import { Plus, X } from 'lucide-react';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSubject, setEditSubject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setSubjects(SUBJECTS);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const gradeLevels = useMemo(() => {
    const unique = [...new Set(subjects.map(s => s.gradeLevels))];
    return unique.sort((a, b) => a - b);
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    if (selectedGrade === 'ALL') return subjects;
    return subjects.filter(s => s.gradeLevels === selectedGrade);
  }, [selectedGrade, subjects]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-tilte">Subjects</h1>
          <p className="page-subtitle">Add and edit Subjects</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 w-full 
        sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {/* Filter Section */}
      <div className="space-y-5">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGrade('ALL')}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                        ${
                          selectedGrade === 'ALL'
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
                            ${
                              selectedGrade === grade
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
            {filteredSubjects.length === 0 ? (
              <p className="text-sm text-slate-400 col-span-full">
                No subjects found for this grade.
              </p>
            ) : (
              filteredSubjects.map(subject => (
                <SubjectCard
                  key={subject.code}
                  subject={subject}
                  onDelete={fetchSubjects}
                  onEdit={setEditSubject}
                />
              ))
            )}
          </div>
        )}

        {/* Create Subject Modal */}
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
                    Add New Subject
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Create a subject with its code and grade level
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
                <SubjectForm
                  onSuccess={() => {
                    setShowCreateModal(false);
                    fetchSubjects();
                  }}
                  onCancel={() => setShowCreateModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Subject Modal */}
        {editSubject && (
          <div
            onClick={() => setEditSubject(null)}
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
                    Edit Subject
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Update Subject details
                  </p>
                </div>
                <button
                  onClick={() => setEditSubject(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors
                text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <SubjectForm
                  initialData={editSubject}
                  onSuccess={() => {
                    setEditSubject(null);
                    fetchSubjects();
                  }}
                  onCancel={() => setEditSubject(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
