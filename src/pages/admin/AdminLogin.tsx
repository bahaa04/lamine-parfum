import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAdminAuthStore } from '../../context/adminAuthStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAdminAuthStore(state => state.login);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(password);

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Authentication failed');
        setPassword('');
      }

      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-espresso to-obsidian flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold rounded-full mb-4">
            <Lock size={40} className="text-ivory" />
          </div>
          <h1 className="font-serif text-4xl text-white mb-2">LAMINE PARFUM</h1>
          <p className="text-gold text-sm tracking-widest uppercase">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-obsidian rounded-lg shadow-2xl p-8">
          <h2 className="font-serif text-2xl text-center mb-2">Administrator Access</h2>
          <p className="text-white/80 text-sm text-center mb-6">Enter your password to continue</p>

          {/* Demo Notice */}
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 mb-6">
            <p className="text-xs text-ivory">
              <strong>Demo:</strong> Password is <code className="bg-gold/20 px-1 rounded">123456</code>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 border border-gold/30 rounded-lg focus:outline-none focus:border-gold transition-colors pr-12"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-ivory transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold/20 text-center">
            <a href="/" className="text-sm text-white/80 hover:text-gold transition-colors">
              ← Back to Store
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs">
            This is a frontend demo with mock authentication.
            <br />
            Production systems require server-side authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
