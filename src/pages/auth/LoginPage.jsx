import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

/**
 * LoginPage - User authentication form
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous error message
    setErrorMsg('');
    
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg('Email and password are required');
      return;
    }

    setSubmitting(true);

    try {
      const user = await login(trimmedEmail, password);
      
      // Navigate users to their corresponding dashboard based on role
      if (user.role === 'HR_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'MENTOR') {
        navigate('/mentor/dashboard', { replace: true });
      } else {
        setErrorMsg('Unauthorized: unrecognized role assignment');
      }
    } catch (err) {
      console.error('Authentication attempt failed:', err);
      
      // Support backend error response shape
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg('Failed to connect to the authentication server. Please check your network connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordToggleBtn = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      disabled={submitting}
      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-indigo-600 focus:ring-1 focus:ring-indigo-500 rounded p-1"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative transition-colors">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 flex items-center justify-center"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>

      <div className="max-w-md w-full">
        <Card bodyClassName="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">HR Management Portal</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to access your dashboard</p>
          </div>

          {errorMsg && (
            <ErrorMessage
              title="Sign in failed"
              message={errorMsg}
              className="mb-5"
            />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
              rightElement={passwordToggleBtn}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

