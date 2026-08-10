'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoPrompt, setDemoPrompt] = useState('symptoms');

  useEffect(() => {
    // Scroll reveal observer
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 80;
      reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // Navbar blur on scroll
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
      if (navbar) {
        if (window.scrollY > 20) {
          navbar.classList.add('shadow-md');
        } else {
          navbar.classList.remove('shadow-md');
        }
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Mouse glow effect
    const glow = document.getElementById('mouse-glow');
    const handleMouseMove = (e: MouseEvent) => {
      if (glow && window.matchMedia('(min-width: 768px)').matches) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('scroll', handleNavScroll);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="bg-[#faf8ff] text-[#191b23] font-sans antialiased overflow-x-hidden selection:bg-[#2563eb] selection:text-white min-h-screen">
      {/* Material Symbols Outlined Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-bottom-color: rgba(15, 23, 42, 0.05);
          border-right-color: rgba(15, 23, 42, 0.05);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
        }

        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(135deg, #004ac6, #8343f4);
        }

        .bg-gradient-brand {
          background: linear-gradient(135deg, #004ac6, #8343f4);
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        #mouse-glow {
          pointer-events: none;
          position: fixed;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(131, 67, 244, 0.08) 0%, rgba(0, 74, 198, 0) 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          transition: opacity 0.3s;
          opacity: 0;
        }

        @media (min-width: 768px) {
          body:hover #mouse-glow {
            opacity: 1;
          }
        }
      `}</style>

      <div id="mouse-glow"></div>

      {/* TopNavBar */}
      <nav id="navbar" className="fixed top-0 w-full z-50 bg-[#faf8ff]/80 backdrop-blur-xl border-b border-white/40 shadow-xs transition-all duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand text-white flex items-center justify-center font-bold text-base shadow-sm">
              ✦
            </div>
            <span className="text-2xl font-extrabold text-[#004ac6] tracking-tight">NexClinic</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#434655]">
            <a href="#features" className="hover:text-[#004ac6] transition">Features</a>
            <a href="#solutions" className="hover:text-[#004ac6] transition">Solutions</a>
            <a href="#ai-suite" className="hover:text-[#004ac6] transition">AI Suite</a>
            <a href="#pricing" className="hover:text-[#004ac6] transition">Pricing</a>
            <a href="#faq" className="hover:text-[#004ac6] transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-[#434655] hover:text-[#004ac6] transition">
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="bg-gradient-brand text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-1.5"
            >
              <span>Explore Portal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-44 md:pb-28 min-h-[90vh] flex items-center overflow-hidden bg-[#004ac6]/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal active space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7e7f3] border border-[#c3c6d7]/30 shadow-xs">
                <span className="text-[#004ac6]">✦</span>
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">AI-Powered Clinic Management v2.4</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-[#191b23] leading-tight tracking-tight">
                Healthcare management, reimagined with <span className="text-gradient">AI</span>.
              </h1>

              <p className="text-base md:text-lg text-[#434655] max-w-xl leading-relaxed font-medium">
                NexClinic brings patients, doctors, EMR records, and VNPay billing into one beautifully connected platform, powered by Gemini artificial intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/login"
                  className="text-white px-8 py-4 rounded-2xl font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-[#004ac6] text-center flex items-center justify-center gap-2"
                >
                  <span>Start Free Trial</span>
                  <span className="material-symbols-outlined text-base">bolt</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-2xl font-bold text-xs border border-[#c3c6d7] text-[#191b23] hover:bg-[#f3f3fe] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <span>View Live Portal Demo</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center gap-6 text-xs text-[#434655] font-semibold border-t border-[#c3c6d7]/20">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">lock</span>
                  <span>ISO 27001 Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-purple-600 text-base">payments</span>
                  <span>VNPay Integrated</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Graphic */}
            <div className="relative reveal floating lg:h-[580px] flex items-center justify-center active" style={{ perspective: '1000px' }}>
              <div className="glass-card w-full max-w-lg rounded-3xl p-6 relative z-10 transition-transform duration-500 [transform:rotateY(-15deg)_rotateX(8deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.02)] space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-[#c3c6d7]/20">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#191b23]">Good morning, Admin 👋</h3>
                    <p className="text-[#434655] text-xs font-medium">Here's your clinic operational summary today.</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#e7e7f3] flex items-center justify-center text-[#191b23]">
                    <span className="material-symbols-outlined text-base">notifications</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/90 rounded-2xl p-4 border border-[#c3c6d7]/20 shadow-xs">
                    <p className="text-[#434655] text-xs font-semibold mb-1">Total Patients</p>
                    <p className="text-3xl font-extrabold text-[#191b23]">1,248</p>
                    <span className="text-[10px] font-bold text-emerald-600">+14% this month</span>
                  </div>
                  <div className="bg-white/90 rounded-2xl p-4 border border-[#c3c6d7]/20 shadow-xs">
                    <p className="text-[#434655] text-xs font-semibold mb-1">Active Doctors</p>
                    <p className="text-3xl font-extrabold text-[#191b23]">24</p>
                    <span className="text-[10px] font-bold text-blue-600">8 Specialties</span>
                  </div>
                </div>

                <div className="bg-white/90 rounded-2xl border border-[#c3c6d7]/20 overflow-hidden shadow-xs">
                  <div className="px-4 py-3 border-b border-[#c3c6d7]/20 bg-[#f3f3fe] flex justify-between items-center">
                    <p className="font-bold text-xs text-[#191b23]">Upcoming Appointments</p>
                    <span className="text-[10px] font-extrabold text-[#004ac6]">Live Stream</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">NA</div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#191b23]">Nguyen Van An</p>
                        <p className="text-[10px] text-[#434655]">Cardiology Checkup</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#191b23]">09:00 AM</p>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Confirmed</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#8343f4] text-white flex items-center justify-center text-xs font-bold">TB</div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#191b23]">Tran Thi Binh</p>
                        <p className="text-[10px] text-[#434655]">Dermatology</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#191b23]">10:30 AM</p>
                        <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Card */}
              <div className="absolute -bottom-8 -right-4 md:-right-10 glass-card rounded-2xl p-4 z-20 max-w-[290px] shadow-2xl floating" style={{ animationDelay: '-3s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 bg-gradient-brand shadow-md">
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#191b23] mb-1">✨ NexAI Clinical Insights</p>
                    <p className="text-[11px] text-[#434655] leading-relaxed font-medium">
                      Summarized 14 EMR records yesterday. 3 patients flagged for critical follow-up consultation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof Marquee */}
      <section className="py-12 border-y border-[#c3c6d7]/20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-xs font-bold text-[#434655] uppercase tracking-widest">
            Trusted by 500+ clinics and medical institutions nationwide
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-16 items-center w-max animate-marquee opacity-70">
            <span className="text-xl font-extrabold text-[#191b23]">MediCore Health</span>
            <span className="text-xl font-extrabold text-[#191b23]">CareConnect Systems</span>
            <span className="text-xl font-extrabold text-[#191b23]">NovaHealth Network</span>
            <span className="text-xl font-extrabold text-[#191b23]">Vitality Medical</span>
            <span className="text-xl font-extrabold text-[#191b23]">MayoCare Clinics</span>
            <span className="text-xl font-extrabold text-[#191b23]">ApexHealth Group</span>
            <span className="text-xl font-extrabold text-[#191b23]">MediCore Health</span>
            <span className="text-xl font-extrabold text-[#191b23]">CareConnect Systems</span>
            <span className="text-xl font-extrabold text-[#191b23]">NovaHealth Network</span>
            <span className="text-xl font-extrabold text-[#191b23]">Vitality Medical</span>
          </div>
        </div>
      </section>

      {/* Interactive AI Demo Section (#ai-suite) */}
      <section id="ai-suite" className="py-24 bg-[#faf8ff] border-b border-[#c3c6d7]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal active space-y-3">
            <span className="text-xs font-extrabold text-[#8343f4] uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              Interactive Gemini Engine
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#191b23]">Experience NexAI in Action</h2>
            <p className="text-base text-[#434655] max-w-2xl mx-auto font-medium">
              Click a sample clinical prompt below to test real-time AI symptom triage and documentation capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Prompt Selector Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setDemoPrompt('symptoms')}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  demoPrompt === 'symptoms'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white text-[#191b23] border-[#c3c6d7]/40 hover:border-purple-300'
                }`}
              >
                <p className="font-bold text-xs">🧪 AI Symptom Triage & Differential</p>
                <p className={`text-[11px] mt-1 ${demoPrompt === 'symptoms' ? 'text-purple-100' : 'text-[#434655]'}`}>
                  Analyze persistent cough & fever for diagnostic probability.
                </p>
              </button>

              <button
                onClick={() => setDemoPrompt('emr')}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  demoPrompt === 'emr'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white text-[#191b23] border-[#c3c6d7]/40 hover:border-purple-300'
                }`}
              >
                <p className="font-bold text-xs">📄 Instant EMR Record Summarizer</p>
                <p className={`text-[11px] mt-1 ${demoPrompt === 'emr' ? 'text-purple-100' : 'text-[#434655]'}`}>
                  Extract key clinical findings from multi-page medical records.
                </p>
              </button>

              <button
                onClick={() => setDemoPrompt('schedule')}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  demoPrompt === 'schedule'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white text-[#191b23] border-[#c3c6d7]/40 hover:border-purple-300'
                }`}
              >
                <p className="font-bold text-xs">📅 Smart Scheduling Optimization</p>
                <p className={`text-[11px] mt-1 ${demoPrompt === 'schedule' ? 'text-purple-100' : 'text-[#434655]'}`}>
                  Identify open doctor shift slots and reduce patient wait duration.
                </p>
              </button>
            </div>

            {/* Simulated Live Output Panel */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-200 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-[#191b23]">NexAI Engine — Live Output</span>
                </div>
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  Confidence Score: 96.4%
                </span>
              </div>

              {demoPrompt === 'symptoms' && (
                <div className="space-y-3 text-xs text-slate-800 animate-in fade-in duration-300">
                  <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <p className="font-bold text-purple-900">Primary Differential Diagnosis:</p>
                    <p className="mt-1">1. Acute Bronchitis (Probability: 85%)</p>
                    <p>2. Upper Respiratory Tract Infection (Probability: 60%)</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-bold text-slate-900">Recommended Next Protocols:</p>
                    <p className="mt-1 text-slate-600">• Order Chest X-Ray (PA View)</p>
                    <p className="text-slate-600">• Complete Blood Count (CBC) with Differential</p>
                  </div>
                </div>
              )}

              {demoPrompt === 'emr' && (
                <div className="space-y-3 text-xs text-slate-800 animate-in fade-in duration-300">
                  <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <p className="font-bold text-purple-900">Patient EMR Summary (#MR-101):</p>
                    <p className="mt-1">
                      Patient has history of mild hypertension. Recent checkup notes resolution of acute symptoms after 7-day antibiotic course.
                    </p>
                  </div>
                </div>
              )}

              {demoPrompt === 'schedule' && (
                <div className="space-y-3 text-xs text-slate-800 animate-in fade-in duration-300">
                  <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <p className="font-bold text-purple-900">Schedule Intelligence:</p>
                    <p className="mt-1">Dr. Nguyen Minh Tuan has 4 open slots remaining today: 14:00, 15:00, 15:30, 16:30.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid (#features) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal active space-y-3">
            <span className="text-xs font-extrabold text-[#004ac6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#191b23]">Everything you need to run your clinic</h2>
            <p className="text-base text-[#434655] max-w-2xl mx-auto font-medium">
              A unified platform designed specifically for modern healthcare providers, clinics, and hospitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#faf8ff] rounded-3xl p-8 border border-[#c3c6d7]/40 reveal hover:shadow-xl transition-all duration-300 flex flex-col h-full md:col-span-2 active">
              <div className="w-12 h-12 rounded-2xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">patient_list</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">Electronic Medical Records (EMR)</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1 font-medium">
                Complete patient profiles, medical histories, ICD-10 diagnoses, and treatment plans in one secure, HIPAA-compliant location.
              </p>
              <div className="mt-auto relative h-48 bg-[#ededf9] rounded-2xl overflow-hidden border border-[#c3c6d7]/30 flex items-center justify-center">
                <div className="text-[#434655] flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-4xl text-[#004ac6]">person</span>
                  <span className="text-xs font-bold">EMR Timeline & Patient Profile Dashboard</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#faf8ff] rounded-3xl p-8 border border-[#c3c6d7]/40 reveal hover:shadow-xl transition-all duration-300 flex flex-col h-full active">
              <div className="w-12 h-12 rounded-2xl bg-[#6a1edb]/10 text-[#6a1edb] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">NexAI Assistant Suite</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1 font-medium">
                Smart medical record summaries, differential diagnosis recommendations, and automated prescription guidance.
              </p>
              <div className="mt-auto relative h-32 bg-[#ededf9] rounded-2xl overflow-hidden border border-[#c3c6d7]/30 flex items-center justify-center">
                <div className="text-[#434655] flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-3xl text-[#6a1edb]">chat</span>
                  <span className="text-xs font-bold">Gemini Clinical Engine</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#faf8ff] rounded-3xl p-8 border border-[#c3c6d7]/40 reveal hover:shadow-xl transition-all duration-300 flex flex-col h-full active">
              <div className="w-12 h-12 rounded-2xl bg-[#00687a]/10 text-[#00687a] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">event_available</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">Smart Doctor Scheduling</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1 font-medium">
                Intelligent 30-minute time slot management, doctor weekly duty shift allocation, and no-show reduction.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#faf8ff] rounded-3xl p-8 border border-[#c3c6d7]/40 reveal hover:shadow-xl transition-all duration-300 flex flex-col h-full md:col-span-2 active">
              <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center mb-6 shadow-md">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">VNPay Gateway & Pharmacy Inventory</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1 font-medium">
                Instant VNPay QR payment checkout, drug catalog management, unit pricing, and printed prescription records.
              </p>
              <div className="mt-auto relative h-48 bg-[#ededf9] rounded-2xl overflow-hidden border border-[#c3c6d7]/30 flex items-center justify-center">
                <div className="text-[#434655] flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">credit_card</span>
                  <span className="text-xs font-bold">VNPay Online Payment & Prescription Billing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Matrix (#solutions) */}
      <section id="solutions" className="py-24 bg-[#faf8ff] border-t border-[#c3c6d7]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal active space-y-3">
            <span className="text-xs font-extrabold text-[#004ac6] uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              Role-Based Solutions
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#191b23]">Tailored for Every Clinical Role</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">stethoscope</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Physicians & Doctors</h3>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>• One-click AI EMR clinical summaries</li>
                <li>• Automated prescription generator (#RX-001)</li>
                <li>• Custom weekly schedule shift grid</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Patients</h3>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>• Easy online appointment booking</li>
                <li>• AI symptom analyzer & triage guidance</li>
                <li>• Instant VNPay online bill payment</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Clinic Directors</h3>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li>• Real-time financial revenue analytics</li>
                <li>• Role-Based Access Control (RBAC)</li>
                <li>• Department workload monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (#pricing) */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal active space-y-3">
            <span className="text-xs font-extrabold text-[#004ac6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#191b23]">Simple Plans for Clinics of Any Size</h2>
            <p className="text-base text-[#434655] max-w-xl mx-auto font-medium">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-[#faf8ff] rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#191b23]">Starter Clinic</h3>
                <p className="text-xs text-[#434655]">Perfect for small independent clinics starting digital EMR.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#191b23]">$49</span>
                  <span className="text-xs text-[#434655] font-semibold">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2">✓ Up to 3 Active Doctors</li>
                  <li className="flex items-center gap-2">✓ 500 Patient Profiles</li>
                  <li className="flex items-center gap-2">✓ Standard Appointment Calendar</li>
                  <li className="flex items-center gap-2">✓ Basic Prescription Records</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs text-center block hover:bg-slate-800 transition"
              >
                Choose Starter
              </Link>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between space-y-6 relative border border-purple-400/40">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                ✦ Most Popular — AI Powered
              </div>
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold">Pro AI Clinic</h3>
                <p className="text-xs text-purple-200">For growing medical centers seeking AI clinical automation.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$149</span>
                  <span className="text-xs text-purple-200 font-semibold">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-purple-100 font-medium pt-4 border-t border-purple-700/60">
                  <li className="flex items-center gap-2">✓ Unlimited Doctors & Patients</li>
                  <li className="flex items-center gap-2">✓ ✨ NexAI Assistant Suite Included</li>
                  <li className="flex items-center gap-2">✓ One-Click EMR AI Summaries</li>
                  <li className="flex items-center gap-2">✓ Integrated VNPay Online Checkout</li>
                  <li className="flex items-center gap-2">✓ Priority 24/7 Support</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-white text-purple-900 font-extrabold text-xs text-center block hover:bg-purple-50 transition shadow-md"
              >
                Start Pro 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#faf8ff] rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#191b23]">Hospital Network</h3>
                <p className="text-xs text-[#434655]">For large multi-branch hospital networks and enterprise providers.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#191b23]">Custom</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2">✓ Multi-Branch Clinic Synchronization</li>
                  <li className="flex items-center gap-2">✓ Dedicated Gemini AI Instance</li>
                  <li className="flex items-center gap-2">✓ Custom API & EMR Data Migration</li>
                  <li className="flex items-center gap-2">✓ Dedicated Account Manager & SLA</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-3 rounded-xl border border-slate-300 text-slate-900 font-bold text-xs text-center block hover:bg-slate-100 transition"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (#faq) */}
      <section id="faq" className="py-24 bg-[#faf8ff] border-t border-[#c3c6d7]/20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center reveal active space-y-3">
            <span className="text-xs font-extrabold text-[#004ac6] uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              Questions & Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#191b23]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is NexClinic compliant with HIPAA and medical data privacy standards?',
                a: 'Yes! All patient data, clinical notes, and EMR records are protected with 256-bit AES encryption in transit and at rest, strictly complying with HIPAA and ISO 27001 security guidelines.',
              },
              {
                q: 'How does the NexAI Assistant assist doctors without replacing clinical judgment?',
                a: 'NexAI operates purely as a clinical decision-support tool. It analyzes symptoms and medical histories to generate differential diagnosis suggestions and lab protocols, but official diagnosis and treatment decisions remain 100% with licensed physicians.',
              },
              {
                q: 'Does NexClinic support VNPay online payments in Vietnam?',
                a: 'Yes, NexClinic natively integrates with the VNPay online payment gateway, allowing patients to complete consultation fees via QR code scanning or online banking.',
              },
              {
                q: 'Can I import patient data from our existing EMR system?',
                a: 'Our team provides automated data migration scripts and CSV import utilities to transition your patient database and historical checkups effortlessly.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-xs text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-base text-slate-400 font-bold">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glowing CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-10 md:p-14 text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Ready to transform your clinic operations?
            </h2>
            <p className="text-sm md:text-base text-blue-100 max-w-xl mx-auto font-medium leading-relaxed">
              Join hundreds of medical providers delivering faster, AI-assisted healthcare to thousands of patients today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="px-8 py-4 rounded-2xl bg-white text-blue-700 font-extrabold text-xs hover:bg-blue-50 transition shadow-xl"
              >
                Start 14-Day Free Trial
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition border border-white/20 backdrop-blur-xs"
              >
                Launch Live Portal Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#c3c6d7]/30 bg-[#ededf9]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <span className="text-3xl font-extrabold text-[#004ac6] block">NexClinic</span>
            <p className="text-xs text-[#434655] leading-relaxed font-medium">
              Precision medicine through AI innovation. Streamlining clinical workflows, patient management, and healthcare intelligence.
            </p>
            <p className="text-[11px] text-slate-400">
              © 2026 NexClinic. All rights reserved.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-xs text-[#191b23] mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-xs text-[#434655] font-semibold">
              <li><a className="hover:text-[#004ac6] transition" href="#features">EMR Records</a></li>
              <li><a className="hover:text-[#004ac6] transition" href="#ai-suite">NexAI Assistant</a></li>
              <li><a className="hover:text-[#004ac6] transition" href="#features">Doctor Scheduling</a></li>
              <li><a className="hover:text-[#004ac6] transition" href="#features">VNPay Billing</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-xs text-[#191b23] mb-4 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-xs text-[#434655] font-semibold">
              <li><a className="hover:text-[#004ac6] transition" href="#solutions">For Physicians</a></li>
              <li><a className="hover:text-[#004ac6] transition" href="#solutions">For Patients</a></li>
              <li><a className="hover:text-[#004ac6] transition" href="#solutions">For Directors</a></li>
              <li><a className="hover:text-[#004ac6] transition" href="#pricing">Pricing Plans</a></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2 space-y-4">
            <h4 className="font-bold text-xs text-[#191b23] uppercase tracking-wider">Compliance & Security</h4>
            <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">HIPAA Compliant</span>
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">ISO 27001</span>
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">VNPay Approved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
