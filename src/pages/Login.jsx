import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { isValidEmail } from '../utils/validators.js';
import { MASCOTS } from '../constants/mascots.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const verifiedEmail = location.state?.email;

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 p-2.5 shadow-sm">
              <img src="/assets/Group 6.svg" alt="EcoSort AI" className="w-9 h-9 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your EcoSort AI account</p>
          </div>

          {location.state?.verified && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700" role="status">
              Email verified successfully. You can now sign in{verifiedEmail ? ` as ${verifiedEmail}` : ''}.
            </div>
          )}

          {/* Mascot 6 — Unsuccessful Login / Authentication Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4">
              <img
                src={MASCOTS.ERROR}
                alt="Unsuccessful login"
                className="w-14 h-14 object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-red-900 uppercase tracking-wider">Authentication Failed</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: null })); }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: null })); }}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
