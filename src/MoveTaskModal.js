import React, { useState } from 'react';
import { ChevronDown, Loader } from 'lucide-react';

const MoveTaskModal = ({ segments, onMove, onClose, taskId }) => {
  const [selectedSegment, setSelectedSegment] = useState('');
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = async () => {
    if (selectedSegment) {
      setIsMoving(true);
      await onMove(taskId, selectedSegment);
      setIsMoving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Move Task to Segment</h3>
        <div className="relative mb-4">
          <select 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none"
            onChange={(e) => setSelectedSegment(e.target.value)}
            value={selectedSegment}
            disabled={isMoving}
          >
            <option value="" disabled>Select a segment</option>
            <option value="All">All</option>
            {segments.map(segment => (
              <option key={segment} value={segment}>{segment}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isMoving}
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={!selectedSegment || isMoving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            {isMoving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Moving...
              </>
            ) : (
              'Move'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveTaskModal;