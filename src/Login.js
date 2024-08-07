import React, { useState } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { CheckCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96 max-w-md">
        <div className="flex justify-center mb-8">
          <CheckCircle size={64} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome to Juno</h2>
        <p className="text-center text-gray-600 mb-8">Organize your tasks efficiently and boost your productivity.</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 shadow-md"
        >
          <FcGoogle className="mr-2" size={24} />
          Sign in with Google
        </button>
        <p className="text-center text-gray-500 mt-6 text-sm">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;