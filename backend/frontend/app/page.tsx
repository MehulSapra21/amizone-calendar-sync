'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for the login link!');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-ocean-dark bg-black p-8 shadow-[0_0_15px_rgba(0,105,148,0.5)]">
        <h1 className="mb-6 text-center text-2xl font-bold text-ocean-light">Amizone Calendar Sync</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded bg-gray-900 p-3 text-white border border-ocean-dark focus:border-ocean-light focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded bg-gray-900 p-3 text-white border border-ocean-dark focus:border-ocean-light focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-ocean p-3 font-semibold text-white transition hover:bg-ocean-light"
          >
            Sign Up / Log In
          </button>
        </form>
      </div>
    </main>
  );
}