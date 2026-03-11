'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, LayoutTemplate, BarChart2, Share2, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-purple-500 selection:text-white"
      style={{
        backgroundImage: 'url(/auraform_hero_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-5xl w-full text-center space-y-10">

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/5 text-purple-300 px-5 py-2 rounded-full text-sm font-semibold backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <Sparkles size={14} className="text-purple-400" />
          <span>AuraForms — AI-Powered Form Builder</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
          Build beautiful forms{' '}
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400">
            in seconds.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Design, publish, and analyze forms with ease. Collect real responses and view beautiful live analytics — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <Link
            href="/builder"
            className="group flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-violet-500 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 active:scale-95 duration-200"
          >
            <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
            <span>Start Building Now</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 bg-white/5 text-white px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-xl active:scale-95 duration-200"
          >
            <BarChart2 size={20} />
            <span>View Dashboard</span>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {[
            { icon: <LayoutTemplate size={15} />, label: 'Drag & Drop Builder' },
            { icon: <Share2 size={15} />, label: 'Instant Publishing' },
            { icon: <BarChart2 size={15} />, label: 'Live Analytics' },
            { icon: <Sparkles size={15} />, label: 'AI-Generated Forms' },
            { icon: <Zap size={15} />, label: 'Lightning Fast' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center space-x-2 bg-white/5 text-gray-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 hover:border-purple-500/40 hover:text-purple-300 transition-all duration-200"
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
