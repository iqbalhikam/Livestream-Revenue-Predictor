'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, TrendingUp, Activity, MessageCircle, MousePointer2, Clock, AlertCircle, Lightbulb, AlertTriangle, ChevronDown, ChevronUp, Users, Eye, UserPlus, Share2, Layout, Percent, Globe, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { dictionaries } from '@/lib/dictionaries';

// --- Interfaces ---

interface PredictionData {
  // Basic (Required)
  Views: number;
  Likes: number;
  Comments: number;
  'Product clicks': number;
  Duration: number;

  // Advanced (Optional, Default 0)
  Viewers: number;
  'Peak viewers': number;
  'New followers': number;
  'Avg. view duration': number;
  Shares: number;
  'Product impressions': number;
  CTR: number;
}

interface ApiResponse {
  prediction: number;
}

// --- Constants & Limits ---

const LIMITS = {
  VIEWS: 10000000,
  LIKES: 5000000,
  COMMENTS: 100000,
  PRODUCT_CLICKS: 50000,
  DURATION: 1000, // as requested
  VIEWERS: 1000000,
  PEAK_VIEWERS: 1500000,
  NEW_FOLLOWERS: 100000,
  AVG_VIEW_DURATION: 1000,
  SHARES: 50000,
  PRODUCT_IMPRESSIONS: 1000000,
  CTR: 100, // Percentage
};

// --- Demo Data ---
const DEMO_DATA: PredictionData = {
  Views: 9932,
  Likes: 6692,
  Comments: 564,
  'Product clicks': 4796,
  Duration: 714,
  Viewers: 7958,
  'Peak viewers': 44,
  'New followers': 69,
  'Avg. view duration': 19,
  Shares: 15,
  'Product impressions': 121200,
  CTR: 48,
};

export default function PredictionPage() {
  // --- State ---
  const { language, toggleLanguage } = useLanguage();
  const dict = dictionaries[language].prediction;
  const common = dictionaries[language].common;

  // Form State
  const [formData, setFormData] = useState<PredictionData>({
    Views: 0,
    Likes: 0,
    Comments: 0,
    'Product clicks': 0,
    Duration: 0,
    Viewers: 0,
    'Peak viewers': 0,
    'New followers': 0,
    'Avg. view duration': 0,
    Shares: 0,
    'Product impressions': 0,
    CTR: 0,
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeDemoField, setActiveDemoField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const hasRunDemo = useRef(false);

  // --- Demo Logic ---
  const searchParams = useSearchParams();

  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam === 'true' && !hasRunDemo.current) {
      hasRunDemo.current = true;
      setIsDemoMode(true);
      setIsAdvancedMode(true);
      runDemoSequence();
    }
  }, [searchParams]);

  const runDemoSequence = async () => {
    const fields = Object.keys(DEMO_DATA) as (keyof PredictionData)[];

    // Helper delay function
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const field of fields) {
      setActiveDemoField(field);
      const targetValue = DEMO_DATA[field];
      const strValue = targetValue.toString();

      // Typing effect
      for (let i = 1; i <= strValue.length; i++) {
        const partialVal = strValue.substring(0, i);
        setFormData((prev) => ({
          ...prev,
          [field]: Number(partialVal),
        }));
        // Random typing speed between 50ms and 150ms
        await delay(50 + Math.random() * 100);
      }

      // Pause between fields
      await delay(300);
    }

    setActiveDemoField(null);
    await delay(500);

    // Animate Button Press
    if (submitButtonRef.current) {
      submitButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await delay(800);

      // Simulate click animation
      submitButtonRef.current.style.transform = 'scale(0.95)';
      await delay(150);
      submitButtonRef.current.style.transform = 'scale(1)';
      await delay(300);
    }

    // Auto-submit
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... existing handler code ...
    const { name, value } = e.target;

    // Stop demo if user interacts manually
    if (isDemoMode && activeDemoField) {
      setIsDemoMode(false);
      setActiveDemoField(null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ... (validateForm and handlePredict unchanged) ...

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Helper to check limits
    const checkLimit = (field: keyof typeof LIMITS, value: number) => {
      if (value > LIMITS[field]) {
        newErrors[field] = dict.errors.limitExceeded.replace('{limit}', LIMITS[field].toLocaleString('id-ID'));
        isValid = false;
      }
    };

    // Helper to check required > 0
    const checkRequired = (field: keyof PredictionData) => {
      const value = Number(formData[field]);
      if (!value || value <= 0) {
        newErrors[field] = dict.errors.mustBeGreaterThanZero;
        isValid = false;
      }
    };

    // CTR Check: Must be integer
    if (!Number.isInteger(Number(formData.CTR))) {
      newErrors.CTR = dict.errors.ctrMustBeInteger;
      isValid = false;
    }

    // Check required fields (> 0)
    checkRequired('Views');
    checkRequired('Likes');
    checkRequired('Comments');
    checkRequired('Product clicks');
    checkRequired('Duration');

    // Check all limits
    checkLimit('VIEWS', Number(formData.Views));
    checkLimit('LIKES', Number(formData.Likes));
    checkLimit('COMMENTS', Number(formData.Comments));
    checkLimit('PRODUCT_CLICKS', Number(formData['Product clicks']));
    checkLimit('DURATION', Number(formData.Duration));

    if (isAdvancedMode) {
      checkLimit('VIEWERS', Number(formData.Viewers));
      checkLimit('PEAK_VIEWERS', Number(formData['Peak viewers']));
      checkLimit('NEW_FOLLOWERS', Number(formData['New followers']));
      checkLimit('AVG_VIEW_DURATION', Number(formData['Avg. view duration']));
      checkLimit('SHARES', Number(formData.Shares));
      checkLimit('PRODUCT_IMPRESSIONS', Number(formData['Product impressions']));
      checkLimit('CTR', Number(formData.CTR));
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not defined');
      }

      const response = await fetch(apiUrl + '/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Details:', errorData);
        throw new Error(errorData?.detail?.[0]?.msg || 'Failed to fetch prediction');
      }

      const data: ApiResponse = await response.json();
      setPrediction(data.prediction);

      // Scroll to result on success
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(dict.errors.fetchFailed);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      {/* ... Navbar and Header ... */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>StreamLytics</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-full border border-transparent hover:border-slate-200">
            <Globe className="w-4 h-4" />
            <span>{language === 'id' ? 'ID' : 'EN'}</span>
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-20 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Header & Intro */}
          <div className="lg:col-span-5 space-y-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                {dict.aiPowered}
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                {dict.title1} <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">{dict.title2}</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">{dict.description}</p>
            </div>

            {/* Prediction Result Card */}
            {prediction !== null && (
              <div className="animate-in fade-in zoom-in-50 duration-500">
                <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <p className="text-indigo-100 font-medium mb-2 uppercase tracking-wide text-xs">{dict.estimatedRevenue}</p>
                    <div className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight flex items-baseline gap-2">
                      {formatCurrency(prediction)}
                      <span className="text-lg font-normal text-indigo-200">IDR</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white text-sm mb-1">{dict.optimizationTip}</p>
                          <p className="text-indigo-100 text-xs leading-relaxed opacity-90">{dict.tipDesc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-100/40 relative overflow-hidden">
              {/* Decorative Orbs */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none"></div>

              {/* Demo Banner */}
              {isDemoMode && (
                <div className="absolute top-0 left-0 w-full bg-linear-to-r from-amber-400/90 to-orange-500/90 text-white text-sm font-bold py-2 px-4 shadow-sm z-10 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4">
                  <Zap className="w-4 h-4 fill-white animate-pulse" />
                  <span>⚡ Live Demo Mode: Simulating High-Traffic Session...</span>
                </div>
              )}

              <form ref={formRef} onSubmit={handlePredict} className={`space-y-6 relative ${isDemoMode ? 'mt-8' : ''}`}>
                {/* Basic Metrics Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> {dict.basicMetrics}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label={dict.labels.views}
                      name="Views"
                      type="number"
                      value={formData.Views}
                      onChange={handleInputChange}
                      icon={<Eye className="w-4 h-4" />}
                      placeholder={dict.placeholders.views}
                      limit={LIMITS.VIEWS}
                      warningText={dict.warnings.limit}
                      error={errors.Views}
                      isActive={activeDemoField === 'Views'}
                      readOnly={isDemoMode}
                    />
                    <InputField
                      label={dict.labels.duration}
                      name="Duration"
                      type="number"
                      value={formData.Duration}
                      onChange={handleInputChange}
                      icon={<Clock className="w-4 h-4" />}
                      placeholder={dict.placeholders.duration}
                      limit={LIMITS.DURATION}
                      warningText={dict.warnings.limit}
                      error={errors.Duration}
                      isActive={activeDemoField === 'Duration'}
                      readOnly={isDemoMode}
                    />
                    <InputField
                      label={dict.labels.productClicks}
                      name="Product clicks"
                      type="number"
                      value={formData['Product clicks']}
                      onChange={handleInputChange}
                      icon={<MousePointer2 className="w-4 h-4" />}
                      placeholder={dict.placeholders.productClicks}
                      limit={LIMITS.PRODUCT_CLICKS}
                      warningText={dict.warnings.limit}
                      error={errors['Product clicks']}
                      isActive={activeDemoField === 'Product clicks'}
                      readOnly={isDemoMode}
                    />
                    <InputField
                      label={dict.labels.likes}
                      name="Likes"
                      type="number"
                      value={formData.Likes}
                      onChange={handleInputChange}
                      icon={<TrendingUp className="w-4 h-4" />}
                      placeholder={dict.placeholders.likes}
                      limit={LIMITS.LIKES}
                      warningText={dict.warnings.limit}
                      error={errors.Likes}
                      isActive={activeDemoField === 'Likes'}
                      readOnly={isDemoMode}
                    />
                    <InputField
                      label={dict.labels.comments}
                      name="Comments"
                      type="number"
                      value={formData.Comments}
                      onChange={handleInputChange}
                      icon={<MessageCircle className="w-4 h-4" />}
                      placeholder={dict.placeholders.comments}
                      limit={LIMITS.COMMENTS}
                      warningText={dict.warnings.limit}
                      error={errors.Comments}
                      isActive={activeDemoField === 'Comments'}
                      readOnly={isDemoMode}
                    />
                  </div>
                </div>

                {/* Advanced Mode Toggle */}
                <div className="border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => setIsAdvancedMode(!isAdvancedMode)} className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors mx-auto">
                    {isAdvancedMode ? (
                      <>
                        <span>{dict.hideAdvanced}</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>{dict.showAdvanced}</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Advanced Metrics Section */}
                {isAdvancedMode && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> {dict.advancedMetrics}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label={dict.labels.viewers}
                        name="Viewers"
                        type="number"
                        value={formData.Viewers}
                        onChange={handleInputChange}
                        icon={<Users className="w-4 h-4" />}
                        limit={LIMITS.VIEWERS}
                        warningText={dict.warnings.limit}
                        error={errors.Viewers}
                        isActive={activeDemoField === 'Viewers'}
                        readOnly={isDemoMode}
                      />
                      <InputField
                        label={dict.labels.peakViewers}
                        name="Peak viewers"
                        type="number"
                        value={formData['Peak viewers']}
                        onChange={handleInputChange}
                        icon={<Activity className="w-4 h-4" />}
                        limit={LIMITS.PEAK_VIEWERS}
                        warningText={dict.warnings.limit}
                        error={errors['Peak viewers']}
                        isActive={activeDemoField === 'Peak viewers'}
                        readOnly={isDemoMode}
                      />
                      <InputField
                        label={dict.labels.newFollowers}
                        name="New followers"
                        type="number"
                        value={formData['New followers']}
                        onChange={handleInputChange}
                        icon={<UserPlus className="w-4 h-4" />}
                        limit={LIMITS.NEW_FOLLOWERS}
                        warningText={dict.warnings.limit}
                        error={errors['New followers']}
                        isActive={activeDemoField === 'New followers'}
                        readOnly={isDemoMode}
                      />
                      <InputField
                        label={dict.labels.avgViewDuration}
                        name="Avg. view duration"
                        type="number"
                        value={formData['Avg. view duration']}
                        onChange={handleInputChange}
                        icon={<Clock className="w-4 h-4" />}
                        limit={LIMITS.AVG_VIEW_DURATION}
                        warningText={dict.warnings.limit}
                        error={errors['Avg. view duration']}
                        isActive={activeDemoField === 'Avg. view duration'}
                        readOnly={isDemoMode}
                      />
                      <InputField
                        label={dict.labels.shares}
                        name="Shares"
                        type="number"
                        value={formData.Shares}
                        onChange={handleInputChange}
                        icon={<Share2 className="w-4 h-4" />}
                        limit={LIMITS.SHARES}
                        warningText={dict.warnings.limit}
                        error={errors.Shares}
                        isActive={activeDemoField === 'Shares'}
                        readOnly={isDemoMode}
                      />
                      <InputField
                        label={dict.labels.productImpressions}
                        name="Product impressions"
                        type="number"
                        value={formData['Product impressions']}
                        onChange={handleInputChange}
                        icon={<Layout className="w-4 h-4" />}
                        limit={LIMITS.PRODUCT_IMPRESSIONS}
                        warningText={dict.warnings.limit}
                        error={errors['Product impressions']}
                        isActive={activeDemoField === 'Product impressions'}
                        readOnly={isDemoMode}
                      />
                      <InputField
                        label={dict.labels.ctr}
                        name="CTR"
                        type="number"
                        value={formData.CTR}
                        onChange={handleInputChange}
                        icon={<Percent className="w-4 h-4" />}
                        limit={LIMITS.CTR}
                        warningText={dict.warnings.limit}
                        error={errors.CTR}
                        isActive={activeDemoField === 'CTR'}
                        readOnly={isDemoMode}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm animate-pulse">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${isDemoMode ? 'pointer-events-none' : ''}`}>
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{common.processing}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{dict.calculate}</span>
                    </>
                  )}
                </button>

                {/* Demo Mode Actions */}
                {isDemoMode && (
                  <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/prediksi')}
                      className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
                      <span>Prediksi Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/')}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Input Component ---

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  placeholder?: string;
  limit?: number;
  warningText?: string;
  error?: string;
  isActive?: boolean;
  readOnly?: boolean;
}

function InputField({ label, name, type = 'text', value, onChange, icon, placeholder, limit, warningText, error, isActive, readOnly }: InputFieldProps) {
  const isOverLimit = limit && typeof value === 'number' && value > limit;
  const isZero = value === 0 && type === 'number';

  return (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ml-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${error ? 'text-red-400' : isActive ? 'text-indigo-600' : 'text-slate-400 group-focus-within:text-indigo-500'}`}>{icon}</div>
        <input
          type={type}
          name={name}
          value={isZero ? '' : value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`peer w-full bg-white/50 border-2 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-medium placeholder-slate-300 focus:outline-none focus:ring-4 transition-all shadow-sm
            ${readOnly ? 'pointer-events-none bg-slate-50/50 text-slate-600' : ''}
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                : isActive
                  ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-[1.02] bg-white shadow-lg z-10'
                  : isOverLimit
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/10'
                    : 'border-slate-100 hover:border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
            }`}
        />
      </div>
      {/* Error Message - Highest Priority */}
      {error && (
        <div className="mt-1 ml-1 flex items-center gap-1.5 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}

      {/* Visual Warning - Only show if no error */}
      {!error && isOverLimit && (
        <div className="mt-1 ml-1 flex items-center gap-1.5 text-xs text-amber-600 font-medium animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          <span>{warningText || `Exceeds limit (${limit?.toLocaleString('id-ID')})`}</span>
        </div>
      )}
    </div>
  );
}
