import React, { useCallback, useEffect, useState } from 'react';
import { dummyTeacherData } from '../assets/myassets';
import { Plus, Search, ShowerHead, X } from 'lucide-react';
import TeacherCard from '../components/TeacherCard';
import TeacherForm from '../components/TeacherForm';
import api from '../api/axios';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editTeacher, setEditTeacher] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await api.get('/teachers')
      setTeachers(res.data.data)
    } catch (error) {
      console.error("Failed to fetch Teachers")
      toast.error(error.response?.data?.error || error?.message)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filtered = teachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Teachers</h1>
          <p className="page-subtitle">Manage Teachers</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 w-full 
        sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full pl-10!"
            type="text"
            placeholder="Search Teachers..."
            onChange={e => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>

      {/* Teacher cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              No teachers found
            </p>
          ) : (
            filtered.map(f => (
              <TeacherCard
                key={f._id}
                teacher={f}
                onDelete={fetchTeachers}
                onEdit={e => setEditTeacher(e)}
              />
            ))
          )}
        </div>
      )}

      {/* Create Teacher Modal */}
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
                  Add New Teacher
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Create a teacher account and profile
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
              <TeacherForm
                onSuccess={() => {
                  setShowCreateModal(false);
                  fetchTeachers();
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editTeacher && (
        <div
          onClick={() => setEditTeacher(null)}
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
                  Edit Teacher
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Update Teacher details
                </p>
              </div>
              <button
                onClick={() => setEditTeacher(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors
                text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <TeacherForm
                initialData={editTeacher}
                onSuccess={() => {
                  setEditTeacher(null);
                  fetchTeachers();
                }}
                onCancel={() => setEditTeacher(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
