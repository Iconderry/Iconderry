import React, { useState } from 'react';
import {
  X, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2,
  AlertCircle, Loader2, LogIn, UserPlus, KeyRound
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function AuthModal({ isOpen, onClose, appTheme = 'dark', onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const isDark = appTheme === 'dark';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google Auth Error:', err);
      setErrorMessage(err.message || 'Failed to authenticate with Google.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'signup') {
        if (!email || !password) {
          throw new Error('Please provide email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name || email.split('@')[0]
            }
          }
        });

        if (error) throw error;

        if (data?.session) {
          setSuccessMessage('Account created successfully! Welcome to Iconderry.');
          if (onAuthSuccess) onAuthSuccess(data.user);
          setTimeout(() => {
            resetForm();
            onClose();
          }, 1500);
        } else {
          setSuccessMessage('Account created! Please check your email to confirm your signup.');
        }
      } else if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setSuccessMessage('Logged in successfully!');
        if (onAuthSuccess) onAuthSuccess(data.user);
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1200);
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Please enter your registered email address.');
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) throw error;

        setSuccessMessage('Password reset link sent! Check your inbox.');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Auth Card */}
      <div 
        className={`relative z-10 w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-hidden transition-all ${
          isDark
            ? 'bg-[#151824] border-slate-800 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl border transition-all cursor-pointer ${
            isDark
              ? 'border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-white'
              : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-600/30">
            {mode === 'signup' ? (
              <UserPlus className="w-6 h-6" />
            ) : mode === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : (
              <LogIn className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === 'signup' ? 'Create Free Account' : mode === 'forgot' ? 'Reset Password' : 'Sign in to Iconderry'}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'signup'
              ? 'Save custom favorites, create collections, and sync assets'
              : mode === 'forgot'
                ? "Enter your email to receive a password reset link"
                : 'Access your cloud assets, favorites, and studio presets'}
          </p>
        </div>

        {/* Social Google Login Button (Shown on login & signup) */}
        {mode !== 'forgot' && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98 ${
                isDark
                  ? 'border-slate-700 bg-[#1c2030] hover:bg-[#252b40] text-white shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className={`px-2 ${isDark ? 'bg-[#151824] text-slate-500' : 'bg-white text-slate-400'}`}>
                  Or continue with email
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition ${
                    isDark
                      ? 'bg-[#1b1f2e] border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition ${
                  isDark
                    ? 'bg-[#1b1f2e] border-slate-700/80 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition ${
                    isDark
                      ? 'bg-[#1b1f2e] border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 active:scale-98 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'forgot' ? (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Mode Switchers */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs">
          {mode === 'login' ? (
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
