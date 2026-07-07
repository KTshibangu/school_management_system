import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import ScoreSelect from './ScoreSelect';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ScoreForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [remarks, setRemarks] = useState('');

  const isInitializing = useRef(false);

  useEffect(() => {
    Promise.all([
      api.get('/classes'),
      api.get('/students'),
      api.get('/assessments'),
    ])
      .then(([classesRes, studentsRes, assessmentsRes]) => {
        setClasses(classesRes.data.data || []);
        setStudents(studentsRes.data.data || []);
        setAssessments(assessmentsRes.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to load form data:', err);
        toast.error('Could not load classes/students/assessments');
      })
      .finally(() => setDataLoading(false));
  }, []);

  const gradeOptions = [...new Set(classes.map(c => c.grade))].sort();

  const classOptions = classes
    .filter(c => !selectedGrade || c.grade === selectedGrade)
    .map(c => ({ label: c.name, value: c._id }));

  const studentOptions = students
    .filter(s => {
      const studentClassId = typeof s.class === 'string' ? s.class : s.class?._id;
      return !selectedClass || studentClassId === selectedClass;
    })
    .map(s => ({ label: `${s.firstName} ${s.lastName}`, value: s._id }));

  const assessmentOptions = assessments
    .filter(a => {
      const assessmentClassId = typeof a.class === 'string' ? a.class : a.class?._id;
      return !selectedClass || assessmentClassId === selectedClass;
    })
    .map(a => ({ label: a.title, value: a._id }));

  useEffect(() => {
    if (!initialData) return;
    isInitializing.current = true;

    const classId = initialData.class?._id || initialData.class || '';
    const classDoc = classes.find(c => c._id === classId);

    setSelectedGrade(initialData.gradeLevel || classDoc?.grade || '');
    setSelectedClass(classId);
    setSelectedAssessment(initialData.assessment?._id || initialData.assessment || '');
    setSelectedStudent(initialData.student?._id || initialData.student || '');
    setScore(String(initialData.score ?? ''));
    setMaxScore(String(initialData.maxScore ?? ''));
    setRemarks(initialData.remarks || '');

    setTimeout(() => {
      isInitializing.current = false;
    }, 0);
  }, [initialData, classes]);

  useEffect(() => {
    if (isInitializing.current) return;
    setSelectedClass('');
    setSelectedAssessment('');
    setSelectedStudent('');
  }, [selectedGrade]);

  useEffect(() => {
    if (isInitializing.current) return;
    setSelectedAssessment('');
    setSelectedStudent('');
  }, [selectedClass]);

  useEffect(() => {
    if (isInitializing.current) return;
    if (!selectedAssessment) return;

    const assessment = assessments.find(a => a._id === selectedAssessment);
    if (assessment) {
      setMaxScore(String(assessment.maxScore));
    }
  }, [selectedAssessment, assessments]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      gradeLevel: selectedGrade,
      class: selectedClass,
      assessment: selectedAssessment,
      student: selectedStudent,
      score: Number(score),
      maxScore: Number(maxScore),
      remarks,
    };

    try {
      const url = isEditMode ? `/scores/${initialData._id}` : '/scores';
      const method = isEditMode ? 'put' : 'post';
      await api[method](url, payload);
      onSuccess ? onSuccess() : navigate('/scores');
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <ScoreSelect
        label="Grade"
        options={gradeOptions}
        value={selectedGrade}
        onChange={setSelectedGrade}
        placeholder={dataLoading ? 'Loading...' : 'Select grade...'}
      />
      <ScoreSelect
        label="Class"
        options={classOptions}
        value={selectedClass}
        onChange={setSelectedClass}
        placeholder={selectedGrade ? 'Select class...' : 'Select a grade first'}
      />
      <ScoreSelect
        label="Assessment"
        options={assessmentOptions}
        value={selectedAssessment}
        onChange={setSelectedAssessment}
        placeholder={
          selectedClass ? 'Select assessment...' : 'Select a class first'
        }
      />
      <ScoreSelect
        label="Student"
        options={studentOptions}
        value={selectedStudent}
        onChange={setSelectedStudent}
        placeholder={
          selectedClass ? 'Select student...' : 'Select a class first'
        }
      />

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Score</label>
        <input
          type="number"
          min={0}
          required
          value={score}
          onChange={e => setScore(e.target.value)}
          placeholder="e.g. 78"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Max Score</label>
        <input
          type="number"
          min={1}
          required
          value={maxScore}
          readOnly
          className='bg-slate-50 cursor-not-allowed'
          placeholder="Auto-filled from Assessment"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Remarks</label>
        <textarea
          rows={4}
          className="resize-none"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          placeholder="Optional remarks about this grade..."
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
          {isEditMode ? 'Update Grade' : 'Capture Grade'}
        </button>
      </div>
    </form>
  );
};

export default ScoreForm;