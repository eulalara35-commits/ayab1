// Purpose: Sign users in to their account.
'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';

const DEMO_ACCOUNTS = [
  { label: 'Commuter', email: 'commuter@ayab.com' },
  { label: 'Driver', email: 'driver@ayab.com' },
  { label: 'Admin', email: 'admin@ayab.com' },
];


export default function LoginPage() {
  const { mounted, currentUser, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!mounted || !currentUser) return;
    router.replace(currentUser.role === 'admin' ? '/admin/dashboard' : `/${currentUser.role}/home`);
  }, [mounted, currentUser, router]);

  function attemptLogin(loginEmail: string, loginPassword: string) {
    setError('');
    setSubmitting(true);
    const user = login(loginEmail, loginPassword);
    setSubmitting(false);
    if (!user) {
      const exists = loginEmail.trim().length > 0;
      setError(
        exists
          ? 'That email and password combination did not match an account, or the account is suspended.'
          : 'Enter your email and password to sign in.',
      );
      return;
    }
    router.replace(user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/home`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    attemptLogin(email, password);
  }

  function useDemoAccount(demoEmail: string) {
    setEmail(demoEmail);
    setPassword('123456');
    attemptLogin(demoEmail, '123456');
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f3f6fa] px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-slate-200/70 blur-3xl" />

      
      <section className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(30,55,90,0.12)]">
        
        <header className="relative overflow-hidden bg-gradient-to-br from-[#edf6ff] via-[#eaf4ff] to-[#dcecff] px-7 pb-7 pt-8 sm:px-9 sm:pt-9">
          <div aria-hidden="true" className="absolute -right-10 -top-12 h-48 w-48 rounded-full border-[28px] border-white/30" />
          <div aria-hidden="true" className="absolute bottom-0 right-16 h-20 w-20 rounded-full bg-white/25 blur-xl" />
          <div className="relative">
            <div className="mb-7 inline-flex h-10 items-center gap-2.5 rounded-full border border-white/80 bg-white/70 px-3.5 shadow-sm shadow-blue-900/5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1769e0] text-[11px] font-extrabold tracking-tight text-white">A</span>
              <span className="font-display text-[12px] font-extrabold tracking-[0.2em] text-[#174b91]">AYAB</span>
            </div>
            <h1 className="font-display text-[32px] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#172b45] sm:text-[36px]">
              Maysa nga AYAB,<br />May tricy agad.
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-9 w-1 rounded-full bg-[#1769e0]" />
              <div>
                <p className="mt-0.5 text-[13px] font-medium text-[#647b97]">Tuguegarao City, Philippines</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-7 pb-8 pt-7 sm:px-9 sm:pb-9">
          <div className="mb-6">
            <h2 className="font-display text-[20px] font-bold tracking-[-0.025em] text-[#172b45]">Welcome back</h2>
            <p className="mt-1 text-[13px] text-[#7a899b]">Sign in to continue to your AYAB account.</p>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#34465c]" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="block h-[50px] w-full rounded-xl border border-[#dce4ed] bg-[#fbfcfe] px-4 text-[14px] text-[#192b42] outline-none transition placeholder:text-[#a4afbd] hover:border-[#bdccdd] focus:border-[#4d8ce2] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#34465c]" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="block h-[50px] w-full rounded-xl border border-[#dce4ed] bg-[#fbfcfe] px-4 text-[14px] text-[#192b42] outline-none transition placeholder:text-[#a4afbd] hover:border-[#bdccdd] focus:border-[#4d8ce2] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-[13px] leading-relaxed text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-[51px] w-full items-center justify-center rounded-xl bg-[#1769e0] text-[14px] font-semibold text-white shadow-[0_7px_16px_rgba(23,105,224,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#125cc9] hover:shadow-[0_10px_22px_rgba(23,105,224,0.25)] active:translate-y-0 active:bg-[#104fae] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
            >
              Log in
              <span aria-hidden="true" className="ml-2 text-[17px] leading-none">→</span>
            </button>
          </form>

          
          <div className="mt-7 border-t border-[#edf0f4] pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold text-[#53657a]">Choose a Demo Account</p>
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9aa7b6]">Quick access</span>
            </div>
            <div role="group" aria-label="Choose a demo account" className="grid grid-cols-3 gap-1 rounded-[14px] bg-[#f1f4f8] p-1">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => useDemoAccount(account.email)}
                  className="min-h-[42px] rounded-[10px] px-2 text-[12px] font-semibold text-[#607187] transition duration-150 hover:bg-white hover:text-[#1769e0] hover:shadow-sm focus-visible:bg-white focus-visible:text-[#1769e0]"
                  type="button"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
