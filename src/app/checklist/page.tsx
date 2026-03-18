"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Circle, ShieldCheck, ChevronRight, Lock, Eye, Volume2 } from 'lucide-react';
import { GlassCard, Button } from '@/components/ui/core-ui';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import Link from 'next/link';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'digital' | 'psychology';
  completed: boolean;
  icon: React.ReactNode;
}

export default function ChecklistPage() {
  const { t } = useLanguage();
  
  const TRANSLATED_ITEMS: ChecklistItem[] = [
    {
      id: 'door-lock',
      title: t.checklist.items.door.title,
      description: t.checklist.items.door.desc,
      category: 'physical',
      completed: false,
      icon: <Lock size={20} />
    },
    {
      id: 'scanner-check',
      title: t.checklist.items.scanner.title,
      description: t.checklist.items.scanner.desc,
      category: 'digital',
      completed: false,
      icon: <Eye size={20} />
    },
    {
      id: 'peephole',
      title: t.checklist.items.peephole.title,
      description: t.checklist.items.peephole.desc,
      category: 'physical',
      completed: false,
      icon: <ShieldCheck size={20} />
    },
    {
      id: 'window-check',
      title: t.checklist.items.window.title,
      description: t.checklist.items.window.desc,
      category: 'physical',
      completed: false,
      icon: <Lock size={20} />
    },
    {
      id: 'voice-check',
      title: t.checklist.items.voice.title,
      description: t.checklist.items.voice.desc,
      category: 'digital',
      completed: false,
      icon: <Volume2 size={20} />
    }
  ];

  const [items, setItems] = useState<ChecklistItem[]>(TRANSLATED_ITEMS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('safestay-checklist');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('safestay-checklist', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <main className="flex min-h-screen flex-col bg-background p-4 md:p-8 space-y-6">
      <nav className="flex items-center justify-between py-4">
        <Link href="/">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <span className="font-bold">{t.checklist.title}</span>
        <div className="w-10" /> {/* Spacer */}
      </nav>

      {/* Progress Card */}
      <GlassCard className="bg-accent/10 border-accent/20 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold">{t.checklist.audit}</h2>
            <p className="text-sm text-foreground/60">{completedCount} {t.checklist.completed}</p>
          </div>
          <span className="text-3xl font-black text-accent">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent shadow-[0_0_10px_var(--accent)] transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </GlassCard>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="cursor-pointer group"
          >
            <GlassCard className={`flex items-center gap-4 transition-all duration-300 ${item.completed ? 'opacity-60 border-secure/30' : 'border-white/5'}`}>
              <div className={`p-4 rounded-xl transition-colors ${item.completed ? 'bg-secure/20 text-secure' : 'bg-white/5 text-foreground/60 group-hover:bg-white/10'}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold transition-all ${item.completed ? 'line-through text-foreground/40' : ''}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-foreground/50">{item.description}</p>
              </div>
              <div className={`transition-colors ${item.completed ? 'text-secure' : 'text-white/20'}`}>
                {item.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Completion Modal / Badge Display */}
      {progressPercent === 100 && (
        <section className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
          <SafetyBadge score={100} date={new Date().toLocaleDateString()} />
          <div className="mt-6 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-black text-accent">{t.checklist.secured}</h2>
            <p className="text-sm text-foreground/60 text-center max-w-[250px]">
              {t.checklist.secured_desc}
            </p>
            <Button variant="primary" glow className="w-full">
              {t.checklist.share}
            </Button>
          </div>
        </section>
      )}

      <footer className="pt-8 pb-12 text-center">
        <p className="text-xs text-foreground/30 px-8">
          {t.checklist.disclaimer}
        </p>
      </footer>
    </main>
  );
}

import { SafetyBadge } from '@/components/ui/SafetyBadge';
