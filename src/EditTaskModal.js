import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EditTaskModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState({
    text: task.text,
    priority: task.priority,
    deadline: task.deadline ? new Date(task.deadline) : null,
    status: task.status
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedTask({
      text: task.text,
      priority: task.priority,
      deadline: task.deadline ? new Date(task.deadline) : null,
      status: task.status
    });
  }, [task]);

  const handleSave = async () => {
    if (editedTask.text.trim()) {
      setIsSaving(true);
      await onSave(task.id, {
        ...editedTask,
        deadline: editedTask.deadline ? editedTask.deadline.toISOString() : null
      });
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Edit Task
        </h3>
        <input
          type="text"
          value={editedTask.text}
          onChange={(e) => setEditedTask({...editedTask, text: e.target.value})}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          placeholder="Task description"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={editedTask.status}
            onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <DatePicker
            selected={editedTask.deadline}
            onChange={(date) => setEditedTask({...editedTask, deadline: date})}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;