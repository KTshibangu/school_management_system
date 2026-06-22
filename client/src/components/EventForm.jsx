import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import {
  EVENT_TYPES,
  EVENT_AUDIENCE,
  EVENT_STATUSES,
} from '../assets/myassets';
import EventSelect from './EventSelect';

const EventForm = ({ initialData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  const [type, setType] = useState('');
  const [audience, setAudience] = useState('');
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isInitializing = useRef(false);

  useEffect(() => {
    if (!initialData) return;
    isInitializing.current = true;
    setTitle(initialData.title || '');
    setDescription(initialData.description || '');
    setType(initialData.type || '');
    setAudience(initialData.audience || '');
    setStatus(initialData.status || '');
    setLocation(initialData.location || '');
    setStartDate(
      initialData.startDate ? initialData.startDate.slice(0, 16) : ''
    );
    setEndDate(initialData.endDate ? initialData.endDate.slice(0, 16) : '');
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
      startDate,
      endDate,
    };
    console.log(data); // replace with API call
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
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            required
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {isEditMode && (
        <EventSelect
          label="Status"
          options={EVENT_STATUSES}
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
