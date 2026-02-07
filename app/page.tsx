'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, BarChart3, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { dictionaries } from '@/lib/dictionaries';

export default function LandingPage() {
  const { language, toggleLanguage } = useLanguage();
  const dict = dictionaries[language].landing;
  const common = dictionaries[language].common;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar Placeholder */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>StreamLytics</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-transparent hover:border-slate-200">
            <Globe className="w-4 h-4" />
            <span>{language === 'id' ? 'ID' : 'EN'}</span>
          </button>
          <button  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            {common.signIn}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-linear-to-b from-indigo-50/80 to-transparent -z-10" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {dict.newModel}
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-100">
            {dict.heroTitle1} <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">{dict.heroTitle2}</span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-200">{dict.heroDesc}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both delay-300">
            <Link href="/prediksi" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-xl shadow-indigo-200/50 transition-all hover:scale-105 flex items-center gap-2 group">
              {common.started}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/prediksi?demo=true" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full border border-slate-200 transition-colors flex items-center justify-center">
              {common.demo}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<BarChart3 className="w-6 h-6 text-indigo-600" />} title={dict.features.f1Title} description={dict.features.f1Desc} />
          <FeatureCard icon={<TrendingUp className="w-6 h-6 text-purple-600" />} title={dict.features.f2Title} description={dict.features.f2Desc} />
          <FeatureCard icon={<ShieldCheck className="w-6 h-6 text-green-600" />} title={dict.features.f3Title} description={dict.features.f3Desc} />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-100/20 group">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
