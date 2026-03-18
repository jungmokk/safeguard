import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn("glass-card p-6 rounded-2xl overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'ghost' | 'outline';
  glow?: boolean;
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  glow = false,
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-accent text-background hover:opacity-90",
    secondary: "glass text-foreground hover:bg-white/10",
    alert: "bg-alert text-foreground hover:opacity-90",
    ghost: "bg-transparent text-foreground hover:bg-white/5",
    outline: "bg-transparent border border-white/10 text-foreground hover:bg-white/5"
  };

  const glowStyles = {
    primary: "glow-accent",
    secondary: "",
    alert: "glow-alert",
    ghost: "",
    outline: ""
  };

  return (
    <button 
      className={cn(
        baseStyles, 
        variants[variant], 
        glow && glowStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
