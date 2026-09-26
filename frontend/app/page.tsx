'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [amizoneId, setAmizoneId] = useState('');
  const [amizonePassword, setAmizonePassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) alert(signUpError.message);
      else alert('Sign up successful! You are now logged in.');
    }
  };

  const handleAmizoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Encrypting and securing credentials...');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session?.user.id,
          amizone_id: amizoneId,
          amizone_password: amizonePassword,
        }),
      });
      
      if (response.ok) {
        setMessage('Credentials securely stored in Supabase!');
        setAmizoneId('');
        setAmizonePassword('');
      } else {
        setMessage('Failed to store credentials.');
      }
    } catch (error) {
      setMessage('Error connecting to backend API.');
    }
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border border-ocean-dark bg-black p-8 shadow-[0_0_15px_rgba(0,105,148,0.5)]">
          <h1 className="mb-6 text-center text-2xl font-bold text-ocean-light">Amizone Calendar Sync</h1>
          <form onSubmit={handleAuth} className="space-y-4">
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
            <button type="submit" className="w-full rounded bg-ocean p-3 font-semibold text-white transition hover:bg-ocean-light">
              Sign Up / Log In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-ocean-dark bg-black p-8 shadow-[0_0_15px_rgba(0,105,148,0.5)]">
        <h1 className="mb-2 text-center text-2xl font-bold text-ocean-light">Connect Amizone</h1>
        <p className="mb-6 text-center text-sm text-gray-400">Your password is AES-256 encrypted before storage.</p>
        <form onSubmit={handleAmizoneSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Amizone ID"
            value={amizoneId}
            onChange={(e) => setAmizoneId(e.target.value)}
            className="w-full rounded bg-gray-900 p-3 text-white border border-ocean-dark focus:border-ocean-light focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Amizone Password"
            value={amizonePassword}
            onChange={(e) => setAmizonePassword(e.target.value)}
            className="w-full rounded bg-gray-900 p-3 text-white border border-ocean-dark focus:border-ocean-light focus:outline-none"
            required
          />
          <button type="submit" className="w-full rounded bg-ocean p-3 font-semibold text-white transition hover:bg-ocean-light">
            Secure & Sync Credentials
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-ocean-light">{message}</p>}
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="mt-6 w-full text-sm text-gray-500 hover:text-white transition"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}