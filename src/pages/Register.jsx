import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, ShieldCheck } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import Button from '../components/ui/Button.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { isValidEmail, isValidPassword, getPasswordError } from '../utils/validators.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationStep, setVerificationStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    else if (!isValidPassword(password)) errors.password = getPasswordError(password);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    setLoading(true);

    try {
      const data = await register({ name, email, password });
      if (!data.success) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
      setVerificationStep(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit verification code sent to your email.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await verifyOtp({ email: email.trim(), otp });
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed. Please try again.');
      }
      navigate('/login', {
        replace: true,
        state: { verified: true, email: email.trim() },
      });
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
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
            <h1 className="text-2xl font-bold text-gray-900">
              {verificationStep ? 'Verify Your Email' : 'Create Account'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {verificationStep
                ? `Enter the 6-digit code sent to ${email}.`
                : 'Join EcoSort AI and start sorting smarter'}
            </p>
          </div>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-6" />}

          {verificationStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email verification code
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setError(null);
                    }}
                    placeholder="6-digit code"
                    aria-label="6-digit email verification code"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                <ShieldCheck className="w-4 h-4" />
                Verify Email
              </Button>
              <button
                type="button"
                className="w-full text-sm font-medium text-primary-600 hover:text-primary-700"
                onClick={() => {
                  setVerificationStep(false);
                  setOtp('');
                  setError(null);
                }}
              >
                Back to registration
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: null })); }}
                  placeholder="Your full name"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  autoComplete="name"
                />
              </div>
              {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
            </div>

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
                  placeholder="Min 8 chars, uppercase, lowercase, number"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  autoComplete="new-password"
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
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </form>
          )}

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>

        {!verificationStep && (
          <p className="text-xs text-center text-gray-400 mt-4">
            You&apos;ll need to verify your email before signing in.
          </p>
        )}
      </div>
    </PageContainer>
  );
}
