'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    // Scroll reveal observer
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 100;
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
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.4);
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
      <nav id="navbar" className="fixed top-0 w-full z-50 bg-[#faf8ff]/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="text-2xl font-bold text-[#004ac6]">
            NexClinic
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#434655]">
            <a href="#" className="text-[#004ac6] font-semibold border-b-2 border-[#004ac6] pb-1">Product</a>
            <a href="#" className="hover:text-[#004ac6] transition">Solutions</a>
            <a href="#" className="hover:text-[#004ac6] transition">Features</a>
            <a href="#" className="hover:text-[#004ac6] transition">AI</a>
            <a href="#" className="hover:text-[#004ac6] transition">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-[#434655] hover:text-[#004ac6] transition">Login</Link>
            <button className="bg-gradient-brand text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-transform duration-200">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-48 md:pb-32 min-h-[90vh] flex items-center overflow-hidden bg-[#004ac6]/5">
        <div className="absolute inset-0 z-0 opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal active">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7e7f3] border border-[#c3c6d7]/30 mb-8">
                <span className="text-[#004ac6]">✦</span>
                <span className="text-xs font-semibold text-[#434655] uppercase tracking-wider">AI-powered clinic management</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#191b23] mb-6 leading-tight">
                Healthcare management, reimagined with <span className="text-[#004ac6]">AI</span>.
              </h1>
              <p className="text-lg text-[#434655] mb-10 max-w-xl leading-relaxed">
                NexClinic brings patients, doctors, and operational data into one beautifully connected platform, powered by advanced artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-[#004ac6]">
                  Get Started
                </button>
                <button className="px-8 py-4 rounded-xl font-medium border border-[#c3c6d7] text-[#191b23] hover:bg-[#f3f3fe] transition-colors duration-300 flex items-center justify-center gap-2">
                  <span>Explore NexClinic</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="relative reveal floating lg:h-[600px] flex items-center justify-center active" style={{ perspective: '1000px' }}>
              {/* Dashboard Preview Graphic */}
              <div className="glass-card w-full max-w-lg rounded-2xl p-6 relative z-10 transition-transform duration-500 [transform:rotateY(-20deg)_rotateX(10deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.02)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#191b23]">Good morning, Admin 👋</h3>
                    <p className="text-[#434655] text-sm">Here's your clinic overview for today.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#e7e7f3] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#191b23]">notifications</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 border border-[#c3c6d7]/20">
                    <p className="text-[#434655] text-sm mb-1">Total Patients</p>
                    <p className="text-3xl font-bold text-[#191b23]">1,248</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#c3c6d7]/20">
                    <p className="text-[#434655] text-sm mb-1">Active Doctors</p>
                    <p className="text-3xl font-bold text-[#191b23]">24</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#c3c6d7]/20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c3c6d7]/20 bg-[#f3f3fe]">
                    <p className="font-medium text-sm text-[#191b23]">Upcoming Appointments</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-medium">JD</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#191b23]">John Doe</p>
                        <p className="text-xs text-[#434655]">General Checkup</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#191b23]">09:00 AM</p>
                        <p className="text-xs text-emerald-600 font-semibold">Confirmed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8343f4] text-white flex items-center justify-center text-xs font-medium">AS</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#191b23]">Alice Smith</p>
                        <p className="text-xs text-[#434655]">Cardiology</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#191b23]">10:30 AM</p>
                        <p className="text-xs text-[#434655]">Waiting</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Card */}
              <div className="absolute -bottom-8 -right-4 md:-right-12 glass-card rounded-xl p-4 z-20 max-w-[280px] shadow-2xl floating" style={{ animationDelay: '-3s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0 bg-[#004ac6]">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1 text-[#191b23]">✨ NexAI Insights</p>
                    <p className="text-xs text-[#434655] leading-relaxed">Summarized 14 patient records from yesterday. Identified 3 critical follow-ups needed for Dr. Sarah.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-12 border-y border-[#c3c6d7]/20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-xs font-semibold text-[#434655] uppercase tracking-widest">Trusted by teams building the future of healthcare</p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-16 items-center w-max animate-marquee opacity-60 grayscale">
            <h3 className="text-xl font-bold text-[#191b23]">MediCore</h3>
            <h3 className="text-xl font-bold text-[#191b23]">HealthPlus</h3>
            <h3 className="text-xl font-bold text-[#191b23]">CareConnect</h3>
            <h3 className="text-xl font-bold text-[#191b23]">Vitality Systems</h3>
            <h3 className="text-xl font-bold text-[#191b23]">NovaHealth</h3>
            <h3 className="text-xl font-bold text-[#191b23]">MediCore</h3>
            <h3 className="text-xl font-bold text-[#191b23]">HealthPlus</h3>
            <h3 className="text-xl font-bold text-[#191b23]">CareConnect</h3>
            <h3 className="text-xl font-bold text-[#191b23]">Vitality Systems</h3>
            <h3 className="text-xl font-bold text-[#191b23]">NovaHealth</h3>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal active">
            <h2 className="text-3xl font-bold text-[#191b23] mb-4">Everything you need to run your clinic</h2>
            <p className="text-lg text-[#434655] max-w-2xl mx-auto">A unified platform designed for modern healthcare providers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/30 reveal hover:shadow-lg transition-shadow duration-300 flex flex-col h-full md:col-span-2 active">
              <div className="w-12 h-12 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">patient_list</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">Patient Management</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1">Complete patient profiles, medical histories, and treatment plans in one accessible, secure location.</p>
              <div className="mt-auto relative h-48 bg-[#ededf9] rounded-xl overflow-hidden border border-[#c3c6d7]/20 flex items-center justify-center">
                <div className="text-[#434655]/50 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl mb-2">person</span>
                  <span className="text-xs">Patient UI Preview</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/30 reveal hover:shadow-lg transition-shadow duration-300 flex flex-col h-full active">
              <div className="w-12 h-12 rounded-xl bg-[#6a1edb]/10 text-[#6a1edb] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">NexAI Assistant</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1">Smart medical summaries, predictive insights, and automated documentation.</p>
              <div className="mt-auto relative h-32 bg-[#ededf9] rounded-xl overflow-hidden border border-[#c3c6d7]/20 flex items-center justify-center">
                <div className="text-[#434655]/50 flex flex-col items-center">
                  <span className="material-symbols-outlined text-3xl mb-1">chat</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/30 reveal hover:shadow-lg transition-shadow duration-300 flex flex-col h-full active">
              <div className="w-12 h-12 rounded-xl bg-[#00687a]/10 text-[#00687a] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">event_available</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">Smart Scheduling</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1">Intelligent calendar management that reduces no-shows and optimizes doctor time.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/30 reveal hover:shadow-lg transition-shadow duration-300 flex flex-col h-full md:col-span-2 active">
              <div className="w-12 h-12 rounded-xl bg-[#2563eb] text-white flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h3 className="text-xl font-bold text-[#191b23] mb-3">Clinical Insights</h3>
              <p className="text-sm text-[#434655] mb-6 flex-1">Advanced reporting on clinic performance, financial health, and patient outcomes.</p>
              <div className="mt-auto relative h-48 bg-[#ededf9] rounded-xl overflow-hidden border border-[#c3c6d7]/20 flex items-center justify-center">
                <div className="text-[#434655]/50 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
                  <span className="text-xs">Dashboard UI Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#c3c6d7]/30 bg-[#ededf9]">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <span className="text-3xl font-extrabold text-[#004ac6] mb-6 block">NexClinic</span>
            <p className="text-sm text-[#434655] mb-6">
              © 2024 NexClinic. Precision medicine through AI innovation.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-medium text-[#191b23] mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[#434655]">
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Product</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Solutions</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Features</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">AI</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-medium text-[#191b23] mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[#434655]">
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Pricing</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Careers</a></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-medium text-[#191b23] mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-[#434655]">
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-[#004ac6] transition-colors" href="#">Security</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
