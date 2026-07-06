import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Plus,
  X,
  PencilIcon,
  Trash2Icon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react';
import {
  dummyEventData,
  EVENT_TYPES,
  EVENT_AUDIENCE,
  EVENT_STATUSES,
  getEventStatusDisplay,
  formatDate,
} from '../assets/myassets';
import EventForm from '../components/EventForm';
import EventSelect from '../components/EventSelect';
import { useAuth } from '../context/AuthContext'
import api from '../api/axios';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN';

  const [filterType, setFilterType] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.data)
    } catch (error) {
      console.error("Failed to fetch Events")
      toast.error(error.response?.data?.error || error?.message)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/events/${deleteTarget._id}`);
      setEvents(prev => prev.filter(e => e._id !== deleteTarget._id));
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchType = !filterType || e.type === filterType;
      const matchAudience = !filterAudience || e.audience === filterAudience;
      const matchStatus = !filterStatus || e.status === filterStatus;
      return matchType && matchAudience && matchStatus;
    });
  }, [events, filterType, filterAudience, filterStatus]);

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
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Create and manage school events'
              : 'View upcoming and ongoing school events'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
          >
            <Plus size={16} /> Add Event
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EventSelect
            label="Filter by Type"
            options={EVENT_TYPES}
            value={filterType}
            onChange={setFilterType}
            placeholder="All types"
          />
          <EventSelect
            label="Filter by Audience"
            options={EVENT_AUDIENCE}
            value={filterAudience}
            onChange={setFilterAudience}
            placeholder="All audiences"
          />
          <EventSelect
            label="Filter by Status"
            options={EVENT_STATUSES}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="All statuses"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card p-12 text-center">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => {
            const { label, className: statusClass } = getEventStatusDisplay(
              event.status
            );
            return (
              <div key={event._id} className="card p-5 flex flex-col gap-3">
                {/* Card header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs border mb-2 ${statusClass}`}
                    >
                      {label}
                    </span>
                    <h3 className="font-medium text-slate-800 leading-snug">
                      {event.title}
                    </h3>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditEvent(event)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50
                                            rounded-lg transition-colors cursor-pointer"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50
                                            rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Meta */}
                <div className="space-y-1.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>
                      {formatDate(event.startDateTime)} —{' '}
                      {formatDate(event.endDateTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <UsersIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>
                      {event.audience} · {event.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal &&
        modalShell(
          'Add New Event',
          'Create a school event with audience and schedule',
          <EventForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchEvents();
            }}
            onCancel={() => setShowCreateModal(false)}
          />,
          () => setShowCreateModal(false)
        )}

      {/* Edit Modal */}
      {editEvent &&
        modalShell(
          'Edit Event',
          'Update event details',
          <EventForm
            initialData={editEvent}
            onSuccess={() => {
              setEditEvent(null);
              fetchEvents();
            }}
            onCancel={() => setEditEvent(null)}
          />,
          () => setEditEvent(null)
        )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          className="fixed bg-black/40 backdrop-blur-sm
                inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-2xl
                    shadow-2xl w-full max-w-sm p-6 animate-fade-in"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Delete Event
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium text-slate-700">
                "{deleteTarget.title}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm
                                font-medium rounded-lg transition-colors cursor-pointer"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
