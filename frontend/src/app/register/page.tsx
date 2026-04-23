'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Wallet, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register({ email, password, full_name: fullName });
      // Redirect is handled inside AuthContext.register -> login
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-zinc-950 rounded-xl mb-4">
            <Wallet className="text-white h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Create an account
          </h2>
          <p className="mt-2 text-zinc-500">
            Start managing your wealth with precision today.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                required
                disabled={isSubmitting}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" title="Minimum 8 characters" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary justify-center py-2.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-zinc-950 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
