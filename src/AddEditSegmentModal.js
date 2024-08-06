import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const AddEditSegmentModal = ({ segment, onSave, onClose }) => {
  const [newSegment, setNewSegment] = useState(segment || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNewSegment(segment || '');
  }, [segment]);

  const handleSave = async () => {
    if (newSegment && newSegment.trim()) {
      setIsSaving(true);
      await onSave(segment, newSegment.trim());
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {segment ? 'Edit Segment' : 'Add New Segment'}
        </h3>
        <input
          type="text"
          value={newSegment}
          onChange={(e) => setNewSegment(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          placeholder="Enter segment name"
        />
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
              segment ? 'Save' : 'Add'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditSegmentModal;