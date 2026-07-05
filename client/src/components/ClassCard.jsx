import React from 'react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ClassCard = ({ classes, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (!confirm('Are you want to delete this class')) return;
    try {
      await api.delete(`/classes/${classes.id}`)
      onDelete()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    }
  };
  return (
    <div className="card p-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h4 className="font-medium text-slate-900">{classes.name}</h4>
        <p className="text-xs text-slate-500 mt-1">
          Grade {classes.gradeLevels}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(classes)}
          className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 
                        hover:text-indigo-600 rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          <PencilIcon className="w-4 h-4" />
        </button>

        <button
          onClick={handleDelete}
          className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 rounded-xl
                        shadow-lg transition-all hover:scale-105 disabled:opacity-50"
        >
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
