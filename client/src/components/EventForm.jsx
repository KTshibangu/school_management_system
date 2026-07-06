import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import EventSelect from './EventSelect';
import { EVENT_TYPES, EVENT_AUDIENCE, EVENT_STATUS } from '../constants/EventConstant';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EventForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const [type, setType] = useState('');
  const [audience, setAudience] = useState('');
  const [status, setStatus] = useState(initialData?.status || 'UPCOMING');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const isInitializing = useRef(false);

  useEffect(() => {
    if (!initialData) return;
    isInitializing.current = true;
    setTitle(initialData.title || '');
    setDescription(initialData.description || '');
    setType(initialData.type || '');
    setAudience(initialData.audience || '');
    setStatus(initialData.status || 'UPCOMING');
    setLocation(initialData.location || '');
    setStartDateTime(
      initialData.startDateTime ? initialData.startDateTime.slice(0, 16) : ''
    );
    setEndDateTime(initialData.endDateTime ? initialData.endDateTime.slice(0, 16) : '');
    setTimeout(() => {
      isInitializing.current = false;
    }, 0);
  }, [initialData]);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      title,
      description,
      type,
      audience,
      status,
      location,
      startDateTime,
      endDateTime,
    };

    try {
      const url = isEditMode ? `/events/${initialData._id}` : '/events';
      const method = isEditMode ? 'put' : 'post';
      await api[method](url, data);
      onSuccess ? onSuccess() : navigate('/events');
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
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Term 2 Prize Giving Assembly"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          className="resize-none"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief description of the event..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <EventSelect
          label="Type"
          options={EVENT_TYPES}
          value={type}
          onChange={setType}
          placeholder="Select type..."
        />
        <EventSelect
          label="Audience"
          options={EVENT_AUDIENCE}
          value={audience}
          onChange={setAudience}
          placeholder="Select audience..."
        />
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Location</label>
        <input
          required
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. School Hall"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            required
            value={startDateTime}
            onChange={e => setStartDateTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            required
            value={endDateTime}
            onChange={e => setEndDateTime(e.target.value)}
          />
        </div>
      </div>

      {isEditMode && (
        <EventSelect
          label="Status"
          options={EVENT_STATUS}
          value={status}
          onChange={setStatus}
          placeholder="Select status..."
        />
      )}

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
          {isEditMode ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
