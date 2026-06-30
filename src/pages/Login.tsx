import React, { useState } from "react";
import { Zap, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import logo from '@/assets/illovo-logo-white.png';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate        = useNavigate();
  const { login }       = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'An error occurred');
      } else {
        navigate('/');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">

      {/* --- LEFT SIDE: BRANDING/VISUAL --- */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
        {/* Background layers - Using a very dark green-tinted charcoal for depth */}
        <div className="absolute inset-0 bg-[#051a10]" /> 
        <div className="absolute inset-0 bg-gradient-to-t from-[#006738]/40 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Centered content */}
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center">
          {/* Logo Container (White pill from original) */}
          {/*<div className="flex items-center justify-center bg-[#33783f] px-10 py-6 rounded-full shadow-2xl mb-10 transition-transform hover:scale-105 duration-500">*/}
             <div className="flex items-center justify-center bg-[#ffffff] px-10 py-6 rounded-full shadow-2xl mb-10 transition-transform hover:scale-105 duration-500">
            <img
              src={logo}
              alt="Illovo Logo"
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Text */}
          <div className="max-w-[550px] space-y-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Real-Time Infrastructure Monitoring System <br />
              <span className="text-[#FFD200]">for Industrial IoT</span>
            </h1>
            <p className="text-lg text-zinc-300 font-light leading-relaxed">
              Stay ahead of issues with instant insights into your data center&apos;
              environmental conditions remotely.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 mt-auto pt-10">
          <blockquote className="space-y-2 border-t border-white/10 pt-6">
            <p className="text-sm font-light text-center text-zinc-400 tracking-wide uppercase">
              Powered By <span className="font-bold text-[#ffffff] tracking-normal normal-case">iMoSyS</span>
            </p>
            <p className="text-[10px] text-center text-white font-mono italic">
              Intelligent Monitoring Systems — Version 2.4.0
            </p>
          </blockquote>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="p-4 lg:p-8 h-full flex items-center justify-center bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">

          {/* Header */}
          <div className="flex flex-col space-y-2 text-center">
            {/* Mobile-only icon */}
            <div className="flex lg:hidden justify-center mb-4">
              <div className="flex h-24 w-32 items-center justify-center rounded-xl bg-[#ffffff] shadow-lg shadow-[#006738]/20">
              {/*<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006738] shadow-lg shadow-[#006738]/20">*/}
                {/*<Zap className="h-6 w-6 text-[#FFD200]" />*/}
                <img
                  src={logo}
                  alt="Illovo Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div className={cn("grid gap-6")}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@illovo.com"
                    type="email"
                    autoCapitalize="none"
                    disabled={loading}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-11 shadow-sm focus-visible:ring-[#006738]"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {/*<a href="#" className="text-xs text-[#006738] hover:underline underline-offset-4 font-medium">
                      Forgot password?
                    </a>*/}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    disabled={loading}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-11 shadow-sm focus-visible:ring-[#006738]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 text-base font-semibold bg-[#006738] hover:bg-[#004d2a] text-white transition-all active:scale-95"
                >
                  {loading
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : <ArrowRight className="mr-2 h-4 w-4" />
                  }
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}