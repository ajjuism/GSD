import React from 'react';
import { Inbox, Sun, Tag, PlusCircle, Edit, Trash2 } from 'lucide-react';

const Sidebar = ({ 
  segments, 
  activeSegment, 
  setActiveSegment, 
  setEditingSegment, 
  setDeletingSegment, 
  setIsAddingSegment
}) => {
  return (
    <div className="w-1/4 bg-gray-100 p-6 flex flex-col h-full">
      <h1 className="text-3xl font-extrabold text-gray-500 mt-4 mb-8">Juno Tasks</h1>
      <div className="flex-grow overflow-y-auto space-y-2">
        <button
          onClick={() => setActiveSegment('All')}
          className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center transition-colors duration-300 ${
            activeSegment === 'All'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Inbox className="w-5 h-5 mr-3" />
          All Tasks
        </button>
        <button
          onClick={() => setActiveSegment('Today')}
          className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center transition-colors duration-300 ${
            activeSegment === 'Today'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sun className="w-5 h-5 mr-3" />
          Today
        </button>
        
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-4 px-0">
            Custom Segments
          </h3>
          <div className="space-y-2">
            {segments.map((segment) => (
              <div key={segment} className="group relative">
                <div
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors duration-300 ${
                    activeSegment === segment
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setActiveSegment(segment)}
                    className="flex items-center flex-grow text-left"
                  >
                    <Tag className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{segment}</span>
                  </button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSegment(segment);
                      }} 
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        activeSegment === segment ? 'text-white hover:text-blue-200' : 'text-gray-400 hover:text-blue-500'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingSegment(segment);
                      }} 
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        activeSegment === segment ? 'text-white hover:text-blue-200' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => setIsAddingSegment(true)}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center shadow-sm"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Segment
        </button>
      </div>
    </div>
  );
};

export default Sidebar;