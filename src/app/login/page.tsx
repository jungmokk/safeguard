"use client";

import React, { useState } from 'react';
import { Shield, Mail, Chrome, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { GlassCard, Button } from '@/components/ui/core-ui';
import { signInWithGoogle, signInAnon } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (type: 'google' | 'anon') => {
    setLoading(true);
    try {
      if (type === 'google') await signInWithGoogle();
      else await signInAnon();
      router.push('/profile');
    } catch (e) {
      console.error(e);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-foreground items-center justify-center p-6 space-y-8">
      <div className="w-full flex justify-start -mt-20 mb-10">
        <Link href="/">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={24} />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center glow-accent animate-pulse-slow">
          <Shield className="text-background" size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Access Secure Vault</h1>
          <p className="text-foreground/50 text-sm mt-1">Sync your safety logs and join the community.</p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button 
          className="w-full h-14 bg-white text-black hover:bg-white/90 gap-3"
          onClick={() => handleLogin('google')}
          disabled={loading}
        >
          <Chrome size={20} />
          <span className="font-bold">Sync with Google</span>
        </Button>

        <Button 
          variant="outline" 
          className="w-full h-14 border-white/10 hover:bg-white/5 gap-3"
          onClick={() => handleLogin('anon')}
          disabled={loading}
        >
          <UserCheck size={20} />
          <span className="font-bold">Enter Anonymously</span>
        </Button>

        <p className="text-[10px] text-center text-foreground/30 px-6 uppercase tracking-widest leading-loose">
          Secure end-to-end encryption. Your private data stays private.
        </p>
      </div>

      <div className="flex items-center gap-2 text-blue-400 absolute bottom-12">
        <AlertCircle size={14} />
        <span className="text-xs font-semibold">Join 24,000+ Sentinels worldwide</span>
      </div>
    </main>
  );
}
