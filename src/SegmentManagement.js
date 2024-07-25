import React from 'react';
import { Plus, Loader, ChevronLeft, ChevronRight, X } from 'lucide-react';

const SegmentManagement = ({ 
  segments, 
  activeSegment,
  setActiveSegment, 
  moveSegment, 
  deleteSegment, 
  addSegment, 
  isAddingSegment, 
  newSegment, 
  setNewSegment, 
  handleKeyPress 
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {segments.map((segment, index) => (
        <div key={segment} className="group relative flex items-center transition-all duration-300 ease-in-out">
          <div className="flex items-center">
            <div className="w-0 group-hover:w-5 overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center">
              {index > 0 && (
                <ChevronLeft
                  className="w-4 h-4 cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={() => moveSegment(index, -1)}
                />
              )}
            </div>
            <button
              onClick={() => setActiveSegment(segment)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSegment === segment
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {segment}
            </button>
            <div className="w-0 group-hover:w-5 overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center">
              {index < segments.length - 1 && (
                <ChevronRight
                  className="w-4 h-4 cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={() => moveSegment(index, 1)}
                />
              )}
            </div>
          </div>
          {segment !== 'Personal' && segment !== 'Work' && (
            <div className="absolute -top-2 -right-2 w-0 h-0 group-hover:w-4 group-hover:h-4 overflow-hidden transition-all duration-300 ease-in-out">
              <X
                className="w-4 h-4 cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => deleteSegment(segment)}
              />
            </div>
          )}
        </div>
      ))}
      <div className="flex">
        <input
          type="text"
          value={newSegment}
          onChange={(e) => setNewSegment(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addSegment)}
          placeholder="New segment"
          className="px-4 py-2 rounded-l-full bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none"
        />
        <button
          onClick={addSegment}
          disabled={isAddingSegment}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-4 py-2 rounded-r-full flex items-center justify-center"
        >
          {isAddingSegment ? (
            <Loader className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Plus className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SegmentManagement;