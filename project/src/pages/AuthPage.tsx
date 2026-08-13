import { useState } from 'react';
import { Logo } from '@/components/Logo';
import type { Page } from '@/types';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (page: Page) => void;
}

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left side - form */}
      <div className="flex min-h-screen flex-col px-4 py-8 md:px-12 lg:px-16">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-900 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <Logo className="mb-6" />
              <h1 className="font-display text-2xl font-bold text-ink-900">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-2 text-sm text-ink-500">
                {isLogin
                  ? 'Sign in to access your knowledge base'
                  : 'Start building your second brain today'}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onNavigate('dashboard'); }} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Full name</label>
                  <input type="text" placeholder="Alex Morgan" className="input-field" />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input type="email" placeholder="you@example.com" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-brand-600 hover:text-brand-700">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="btn-primary w-full !py-3">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-100" />
              <span className="text-xs text-ink-400">OR</span>
              <div className="h-px flex-1 bg-ink-100" />
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-secondary w-full !py-3"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-ink-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => onNavigate(isLogin ? 'register' : 'login')}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - visual */}
      <div className="relative hidden overflow-hidden gradient-dark lg:block">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-5" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative flex h-full flex-col justify-center p-16">
          <div className="max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Your knowledge, always available
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-white text-balance">
              The AI assistant that truly
              <span className="block gradient-text">understands your documents.</span>
            </h2>
            <p className="mt-4 text-ink-300">
              BrainDoc uses advanced RAG and semantic search to give you precise, cited answers from your own knowledge base.
            </p>

            <div className="mt-8 space-y-3">
              {['Semantic vector search', 'Source-cited AI responses', 'Secure & private by design'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-ink-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20">
                    <svg className="h-3 w-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
