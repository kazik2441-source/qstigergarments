import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

const AUTHORIZED_OFFICERS = [
  { email: 'kazisanaulla765@gmail.com', password: '8824@', name: 'Super-Admin (Owner)' },
  { email: 'kazik2441@gmail.com', password: '8820@', name: 'Officer 2' },
  { email: 'qstigergarments2010@gmail.com', password: '8920@', name: 'Officer 3' }
];

export default function OfficerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const officer = AUTHORIZED_OFFICERS.find(
      (o) => o.email === email && o.password === password
    );

    if (officer) {
      // Create session
      const sessionId = Date.now().toString();
      const sessionData = {
        sessionId,
        name: officer.name,
        email: officer.email,
        loginTime: new Date().toISOString(),
        logoutTime: null,
        status: 'logged_in'
      };
      await api.setData('active_officer', sessionData);
      
      // Update active officers log
      try {
        const activeOfficers = await api.getData('active_officers_log', []);
        activeOfficers.push(sessionData);
        await api.setData('active_officers_log', activeOfficers);
      } catch(e) {
        console.warn("Storage blocked");
      }

      navigate('/officer-dashboard');
    } else {
      setError('Access Denied. Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-tiger-orange/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-tiger-orange" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900">Officer Portal</h1>
          <p className="text-gray-500 mt-2">Restricted access area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Officer Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
              placeholder="officer@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passcode</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-tiger-orange transition-colors"
          >
            &larr; Return to main site
          </button>
        </div>
      </div>
    </div>
  );
}
