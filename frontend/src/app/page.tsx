'use client';

import Link from 'next/link';
import { Wallet, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
              Welcome to your financial future.{' '}
              <Link href="/register" className="font-semibold text-primary-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Master Your Money with Precision
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            The all-in-one platform for tracking your bank accounts, stocks, and crypto. 
            Real-time insights for your personal finances and trading portfolios.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all"
            >
              Get started for free
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-slate-900 hover:text-primary-600 transition-colors">
              Sign in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-primary-100 p-3 mb-6">
              <Wallet className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <dt className="text-xl font-bold leading-7 text-slate-900">Budgeting</dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
              <p className="flex-auto">Track expenses and income across categories. Set limits and stay on top of your monthly goals with visual indicators.</p>
            </dd>
          </div>
          <div className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-primary-100 p-3 mb-6">
              <TrendingUp className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <dt className="text-xl font-bold leading-7 text-slate-900">Trading & Crypto</dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p className="flex-auto">Monitor your stock and crypto holdings with real-time price updates, cost-basis tracking, and gain/loss analysis.</p>
            </dd>
          </div>
          <div className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-primary-100 p-3 mb-6">
              <ShieldCheck className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <dt className="text-xl font-bold leading-7 text-slate-900">Secure & Private</dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
              <p className="flex-auto">Your financial data is encrypted and isolated. We use industry-standard security to keep your information private.</p>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
