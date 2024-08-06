import React, { useState } from 'react';
import { Loader } from 'lucide-react';

const DeleteSegmentModal = ({ segment, onDelete, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(segment);
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Delete Segment</h3>
        <p className="mb-4 text-gray-600">Are you sure you want to delete the segment "{segment}"? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSegmentModal;