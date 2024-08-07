import React from 'react';
import { X, FileDown, FileUp, Code, LogOut, Settings as SettingsIcon, Bell, Palette } from 'lucide-react';

const SettingsModal = ({ onClose, onLogout, user }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-2/5 max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <SettingsIcon size={32} className="text-blue-500 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-800">Settings</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
            <X size={28} />
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h4 className="text-xl font-semibold text-gray-800">{user.displayName}</h4>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <button className="bg-gray-100 text-gray-500 px-4 py-3 rounded-lg flex items-center justify-between cursor-not-allowed hover:bg-gray-200 transition-colors duration-300">
            <span className="flex items-center">
              <Bell className="mr-2" size={20} />
              Notifications
            </span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Coming Soon</span>
          </button>
          <button className="bg-gray-100 text-gray-500 px-4 py-3 rounded-lg flex items-center justify-between cursor-not-allowed hover:bg-gray-200 transition-colors duration-300">
            <span className="flex items-center">
              <Palette className="mr-2" size={20} />
              Appearance
            </span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Coming Soon</span>
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Data Management</h4>
          <button className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-lg flex items-center justify-between cursor-not-allowed hover:bg-gray-200 transition-colors duration-300">
            <span className="flex items-center">
              <FileDown className="mr-2" size={20} />
              Export Tasks to CSV
            </span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Coming Soon</span>
          </button>
          <button className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-lg flex items-center justify-between cursor-not-allowed hover:bg-gray-200 transition-colors duration-300">
            <span className="flex items-center">
              <FileUp className="mr-2" size={20} />
              Import Tasks
            </span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Coming Soon</span>
          </button>
          <button className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-lg flex items-center justify-between cursor-not-allowed hover:bg-gray-200 transition-colors duration-300">
            <span className="flex items-center">
              <Code className="mr-2" size={20} />
              Snippets
            </span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Coming Soon</span>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;