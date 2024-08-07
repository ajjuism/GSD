import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import TaskManager from './TaskManager';
import Login from './Login';
import SettingsModal from './SettingsModal';
import { Loader } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <Loader className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <>
          <TaskManager user={user} openSettings={() => setIsSettingsOpen(true)} />
          {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} onLogout={handleLogout} user={user} />
          )}
        </>
      ) : (
        <Login onLogin={() => {}} />
      )}
    </div>
  );
}

export default App;