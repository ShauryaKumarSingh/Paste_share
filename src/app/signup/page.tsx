"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Signup failed');
      localStorage.setItem('pb_user', JSON.stringify(data.user));
      // Use replace to avoid back button issues
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-lg p-8 rounded-2xl space-y-6 overflow-hidden w-full box-border">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Create your account</h2>
            <p className="text-sm text-[var(--muted)] mt-2">Sign up to save and manage your pastes.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full">
            <div className="w-full min-w-0">
              <label className="block text-sm font-semibold mb-2" style={{color: 'var(--muted)'}}>Full name</label>
              <input className="input-base w-full box-border" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-sm font-semibold mb-2" style={{color: 'var(--muted)'}}>Email</label>
              <input className="input-base w-full box-border" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-sm font-semibold mb-2" style={{color: 'var(--muted)'}}>Password</label>
              <input type="password" className="input-base w-full box-border" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Choose a password" required />
            </div>
            {error && <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded text-rose-300 text-sm">{error}</div>}
            <button className="btn-primary w-full py-2.5 font-semibold" type="submit" disabled={loading}>{loading? 'Creating...':'Create account'}</button>
          </form>
          <div className="divider"></div>
          <div className="text-center text-sm text-[var(--muted)]">
            Already have an account? <a href="/login" className="font-semibold gradient-text hover:underline">Sign in</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
