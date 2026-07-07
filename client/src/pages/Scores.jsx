import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, X, PencilIcon, Trash2Icon } from 'lucide-react';
import { SCHOOL_TERMS } from '../constants/ScoreConstant';
import { getGradeDisplay } from '../assets/myassets';
import ScoreForm from '../components/ScoreForm';
import ScoreSelect from '../components/ScoreSelect';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editScores, setEditScores] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [filterStudent, setFilterStudent] = useState('');

  const fetchScores = useCallback(async () => {
    try {
      const res = await api.get('/scores');
      setScores(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch Scores");
      toast.error(error.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/scores/${deleteTarget._id}`);
      setScores(prev => prev.filter(s => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    api.get('/classes')
      .then(({ data }) => setClasses(data.data || []))
      .catch((err) => console.error('Failed to load classes:', err));

    api.get('/students')
      .then(({ data }) => setStudents(data.data || []))
      .catch((err) => console.error('Failed to load students:', err));
  }, []);

  useEffect(() => {
    setFilterClass('');
  }, [filterGrade]);

  // grade options derived from Class.grade (matches Score.gradeLevel values)
  const gradeOptions = useMemo(
    () => [...new Set(classes.map(c => c.grade))].sort(),
    [classes]
  );

  // only show classes matching the selected grade
  const classOptions = useMemo(() => {
    return classes
      .filter(c => !filterGrade || c.grade === filterGrade)
      .map(c => ({ label: c.name, value: c._id }));
  }, [classes, filterGrade]);

  // only show students in the selected class (if any)
  const studentOptions = useMemo(() => {
    return students
      .filter(s => !filterClass || s.class?._id === filterClass || s.class === filterClass)
      .map(s => ({ label: `${s.firstName} ${s.lastName}`, value: s._id }));
  }, [students, filterClass]);

  const filteredScores = useMemo(() => {
    return scores.filter(s => {
      const matchGrade = !filterGrade || s.gradeLevel === filterGrade;
      const matchClass = !filterClass || s.class?._id === filterClass;
      const matchTerm = !filterTerm || s.assessment?.term === filterTerm;
      const matchStudent = !filterStudent || s.student?._id === filterStudent;
      return matchGrade && matchClass && matchTerm && matchStudent;
    });
  }, [scores, filterGrade, filterClass, filterTerm, filterStudent]);

  const modalShell = (title, subtitle, content, onClose) => (
    <div
      onClick={onClose}
      className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex 
        items-start justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-2xl 
            shadow-2xl w-full max-w-lg my-8 animate-fade-in"
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 
                    transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{content}</div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Scores</h1>
          <p className="page-subtitle">Capture and track student scores</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={16} /> Capture Grade
        </button>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ScoreSelect
            label="Filter by Grade"
            options={gradeOptions}
            value={filterGrade}
            onChange={setFilterGrade}
            placeholder="All grades"
          />
          <ScoreSelect
            label="Filter by Class"
            options={classOptions}
            value={filterClass}
            onChange={setFilterClass}
            placeholder="All classes"
          />
          <ScoreSelect
            label="Filter by Term"
            options={SCHOOL_TERMS}
            value={filterTerm}
            onChange={setFilterTerm}
            placeholder="All terms"
          />
          <ScoreSelect
            label="Filter by Student"
            options={studentOptions}
            value={filterStudent}
            onChange={setFilterStudent}
            placeholder="All students"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Student</th>
                  <th>Term</th>
                  <th>Class</th>
                  <th>Score</th>
                  <th>Percent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-slate-400 py-10">
                      No scores found
                    </td>
                  </tr>
                ) : (
                  filteredScores.map(s => {
                    const percentage = s.maxScore
                      ? Math.round((s.score / s.maxScore) * 100)
                      : 0;
                    const { grade, className: badgeClass } = getGradeDisplay(percentage);
                    return (
                      <tr key={s._id}>
                        <td className="font-medium text-slate-800">
                          {s.assessment?.title || '—'}
                        </td>
                        <td>
                          {s.student
                            ? `${s.student.firstName} ${s.student.lastName}`
                            : '—'}
                        </td>
                        <td>{s.assessment?.term || '—'}</td>
                        <td>{s.class?.name || '—'}</td>
                        <td>
                          {s.score} / {s.maxScore}
                        </td>
                        <td>{percentage}%</td>
                        <td>
                          <span className={`px-2.5 py-1 rounded-full text-xs border ${badgeClass}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="flex items-center gap-2">
                          <button
                            onClick={() => setEditScores(s)}
                            className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-indigo-600 rounded-xl 
                                                    shadow-lg transition-all hover:scale-105 cursor-pointer"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 
                                                rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal &&
        modalShell(
          'Capture Grade',
          'Record a student grade for an assessment',
          <ScoreForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchScores();
            }}
            onCancel={() => setShowCreateModal(false)}
          />,
          () => setShowCreateModal(false)
        )}

      {/* Edit Modal */}
      {editScores &&
        modalShell(
          'Edit Scores',
          'Update Scores details',
          <ScoreForm
            initialData={editScores}
            onSuccess={() => {
              setEditScores(null);
              fetchScores();
            }}
            onCancel={() => setEditScores(null)}
          />,
          () => setEditScores(null)
        )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Delete Score</h2>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this score
              {deleteTarget.student && (
                <> for <span className="font-medium text-slate-700">
                  {deleteTarget.student.firstName} {deleteTarget.student.lastName}
                </span></>
              )}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Delete Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scores;