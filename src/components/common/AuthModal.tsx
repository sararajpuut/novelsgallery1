import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useStore();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setNotification(`Password reset instructions sent to ${email}`);
      setTimeout(() => {
        setNotification('');
        setMode('login');
      }, 2500);
      return;
    }

    login(email || 'reader@novelsgallery.com', name || 'Reader User', 'reader');
  };

  const handleQuickLogin = (role: 'reader' | 'admin') => {
    if (role === 'admin') {
      login('admin@novelsgallery.com', 'Editorial Admin', 'admin');
    } else {
      login('ayesha.reader@novelsgallery.com', 'Ayesha Khan', 'reader');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#F8F4EA] w-full max-w-md rounded-xl shadow-2xl border border-[#173F35]/20 overflow-hidden">
        {/* Header */}
        <div className="bg-[#173F35] text-[#F8F4EA] p-5 flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold">
              {mode === 'login' ? 'Sign In to Novels Gallery' : mode === 'register' ? 'Create an Account' : 'Reset Password'}
            </h3>
            <p className="text-xs text-[#C8A45D]">
              Save reading progress, bookmarks, and favorite Urdu novels
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 hover:bg-[#12322a] rounded text-[#F8F4EA]/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {notification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {notification}
            </div>
          )}

          {/* Quick Demo Login Buttons */}
          <div className="p-3 bg-[#EEE8D8] rounded-lg border border-[#173F35]/15 space-y-2">
            <span className="text-xs font-semibold text-[#173F35] block">
              ⚡ Instant 1-Click Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('reader')}
                className="py-2 px-3 text-xs font-semibold bg-white text-[#173F35] border border-[#173F35]/20 rounded-md hover:bg-[#173F35] hover:text-white transition-colors cursor-pointer"
              >
                Reader Access
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-3 text-xs font-semibold bg-[#C8A45D] text-[#173F35] border border-[#C8A45D]/40 rounded-md hover:bg-[#b5924a] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin CMS
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#EEE8D8]"></div>
            <span className="flex-shrink mx-3 text-xs text-[#6B6B6B]">or continue with email</span>
            <div className="flex-grow border-t border-[#EEE8D8]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#252525] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#173F35]/20 rounded-md text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#252525] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#173F35]/20 rounded-md text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-medium text-[#252525] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#173F35]/20 rounded-md text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#173F35] text-[#F8F4EA] font-semibold text-sm rounded-md hover:bg-[#12322a] border border-[#C8A45D]/40 transition-colors cursor-pointer shadow-xs"
            >
              {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Free Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Toggle modes */}
          <div className="pt-2 text-center text-xs text-[#6B6B6B] space-y-1">
            {mode === 'login' ? (
              <>
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-[#173F35] font-semibold hover:underline cursor-pointer">
                    Register here
                  </button>
                </p>
                <p>
                  <button onClick={() => setMode('forgot')} className="text-[#4A3025] hover:underline cursor-pointer">
                    Forgot your password?
                  </button>
                </p>
              </>
            ) : mode === 'register' ? (
              <p>
                Already registered?{' '}
                <button onClick={() => setMode('login')} className="text-[#173F35] font-semibold hover:underline cursor-pointer">
                  Sign in instead
                </button>
              </p>
            ) : (
              <button onClick={() => setMode('login')} className="text-[#173F35] font-semibold hover:underline cursor-pointer">
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
