import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, ArrowRight, ChevronRight, Sparkles, CheckCircle2, Upload, Cpu, Recycle } from 'lucide-react';
import { getCategories, FALLBACK_CATEGORIES } from '../services/classificationService.js';
import { MASCOTS } from '../constants/mascots.js';

const categoryMeta = {
  plastic: { tag: 'High Recyclability', desc: 'Bottles, containers, clean packaging' },
  metal: { tag: 'Infinitely Recyclable', desc: 'Cans, foil, tins, metal caps' },
  'e-waste': { tag: 'Special Handling', desc: 'Batteries, cables, small electronics' },
  organic: { tag: 'Compostable', desc: 'Food scraps, fruit peels, yard waste' },
  paper: { tag: 'Recyclable', desc: 'Cardboard, newspapers, office paper' },
  glass: { tag: '100% Recyclable', desc: 'Bottles, jars, glassware' },
};

export default function Home() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [backendCategoriesLoaded, setBackendCategoriesLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((catList) => {
        if (active && Array.isArray(catList) && catList.length > 0) {
          const mapped = catList.map((name) => {
            const fallback = FALLBACK_CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
            return {
              name,
              label: fallback ? fallback.label : name.charAt(0).toUpperCase() + name.slice(1),
              icon: fallback ? fallback.icon : '♻️',
            };
          });
          setCategories(mapped);
          setBackendCategoriesLoaded(true);
        }
      })
      .catch(() => {
        // Keeps fallback categories on network timeout or failure
      });

    return () => { active = false; };
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Snap & Upload',
      description: 'Take a clear photo or drop an image of any waste item from your mobile or desktop.',
      icon: Upload,
    },
    {
      num: '02',
      title: 'AI Classification',
      description: 'Our backend deep learning model classifies the waste category with high confidence.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Disposal Guidance',
      description: 'Receive instant, actionable recycling steps to minimize environmental contamination.',
      icon: Recycle,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-gray-50 border-b border-gray-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100/80 border border-primary-200 text-primary-800 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-primary-600" />
                GDG AI-Powered Waste Sorting Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight">
                Sort Your Waste{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Smarter & Greener
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Upload a photo of your everyday trash and get instant, accurate categorization powered by EcoSort AI.
                Learn proper recycling steps and reduce landfill footprint.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/scanner"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl text-base font-bold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <ScanLine className="w-5 h-5" />
                  Launch Waste Scanner
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-gray-700 bg-white border border-gray-200 rounded-2xl text-base font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  How It Works
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </a>
              </div>

              {/* Feature Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-gray-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Instant Vision AI</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>6 Waste Streams</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Eco Guidance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual — Mascot 1 Exclusively */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-secondary-200 rounded-3xl filter blur-2xl opacity-60 -z-10" />
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <img src="/assets/Group 6.svg" alt="EcoSort AI" className="w-10 h-10 object-contain" />
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">Live AI Classifier</h2>
                        <p className="text-xs text-primary-600 font-medium">EcoSort Neural Pipeline</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Online
                    </span>
                  </div>

                  {/* Mascot 1 Showcase (Hero Exclusive) */}
                  <div className="flex justify-center items-center py-4 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl border border-primary-100/50">
                    <img
                      src={MASCOTS.HERO}
                      alt="EcoSort AI Hero Mascot"
                      className="h-48 sm:h-56 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Classification Confidence</p>
                      <p className="text-sm font-bold text-gray-900">96.8% Precision</p>
                    </div>
                    <Link
                      to="/scanner"
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                      Scan Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section — Mascot-Free, Clean & Balanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Supported Waste Categories
            </h2>
            <p className="mt-3 text-base text-gray-600">
              EcoSort AI identifies six primary streams of municipal and household waste with tailored disposal directions.
              {backendCategoriesLoaded && (
                <span className="block text-xs text-primary-600 font-semibold mt-1">
                  ✓ Verified live from backend endpoint
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const meta = categoryMeta[cat.name.toLowerCase()] || {
                tag: 'Recyclable',
                desc: 'Properly segregated waste',
              };

              return (
                <div
                  key={cat.name}
                  className="group relative flex flex-col justify-between p-6 bg-white rounded-3xl border border-gray-200/80 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-lg">
                        {meta.tag}
                      </span>
                      <span className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors capitalize mb-1">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      Category Stream
                    </span>
                    <Link
                      to="/scanner"
                      className="text-primary-600 hover:text-primary-700 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Classify <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50/80 border-t border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-100/60 px-3 py-1.5 rounded-full">
              Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mt-3">
              How EcoSort AI Works
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Three seamless steps to identify material composition and make responsible recycling choices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black text-primary-200">
                        {step.num}
                      </span>
                      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center p-2 border border-primary-100 text-primary-600">
                        <IconComponent className="w-7 h-7" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Environment Impact Banner */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 via-primary-900 to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <img
            src="/assets/Group 6.svg"
            alt="EcoSort AI Emblem"
            className="w-16 h-16 mx-auto brightness-200"
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Clean Up Your Waste Stream?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Every correctly classified item diverts reusable resources from overflowing landfills.
            Join the EcoSort initiative today.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/scanner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-900 rounded-2xl text-base font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              <ScanLine className="w-5 h-5" />
              Start Sorting Now
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-800/60 border border-emerald-400/40 text-white rounded-2xl text-base font-semibold hover:bg-emerald-800 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
