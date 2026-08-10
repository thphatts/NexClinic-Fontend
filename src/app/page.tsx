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

    // WebGL Shader Background Animation
    const canvas = document.getElementById('shader-canvas-ANIMATION_11') as HTMLCanvasElement | null;
    let animFrameId: number;

    if (canvas) {
      const syncSize = () => {
        const w = canvas.clientWidth || 1280;
        const h = canvas.clientHeight || 720;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      };
      syncSize();

      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (gl) {
        const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
        const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    float noise1 = sin(uv.x * 2.0 + u_time * 0.2) * 0.5 + 0.5;
    float noise2 = cos(uv.y * 3.0 - u_time * 0.15) * 0.5 + 0.5;
    vec3 color1 = vec3(0.145, 0.388, 0.922);
    vec3 color2 = vec3(0.024, 0.714, 0.831);
    vec3 color3 = vec3(0.486, 0.227, 0.929);
    float mixFactor = (noise1 + noise2) * 0.5;
    vec3 baseColor = mix(color1, color2, mixFactor);
    baseColor = mix(baseColor, color3, sin(u_time * 0.1) * 0.2 + 0.2);
    float grid = (step(0.995, fract(uv.x * 20.0)) + step(0.995, fract(uv.y * 20.0)));
    float dist = distance(uv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
    gl_FragColor = vec4(baseColor * vignette + (grid * 0.05), 1.0);
}`;
        const cs = (type: number, src: string) => {
          const s = gl.createShader(type)!;
          gl.shaderSource(s, src);
          gl.compileShader(s);
          return s;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uRes = gl.getUniformLocation(prog, 'u_resolution');

        const render = (t: number) => {
          syncSize();
          gl.viewport(0, 0, canvas.width, canvas.height);
          if (uTime) gl.uniform1f(uTime, t * 0.001);
          if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          animFrameId = requestAnimationFrame(render);
        };
        render(0);
      }
    }

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('scroll', handleNavScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId) cancelAnimationFrame(animFrameId);
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
      <header className="relative pt-32 pb-24 md:pt-48 md:pb-32 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 w-full h-full">
            <canvas id="shader-canvas-ANIMATION_11" className="w-full h-full block" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal active">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7e7f3] border border-[#c3c6d7]/30 mb-8">
                <span className="text-[#6a1edb]">✦</span>
                <span className="text-xs font-semibold text-[#434655] uppercase tracking-wider">AI-powered clinic management</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#191b23] mb-6 leading-tight">
                Healthcare management, reimagined with <span className="text-gradient">AI</span>.
              </h1>
              <p className="text-lg text-[#434655] mb-10 max-w-xl leading-relaxed">
                NexClinic brings patients, doctors, and operational data into one beautifully connected platform, powered by advanced artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-brand text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  Get Started
                </button>
                <button className="px-8 py-4 rounded-xl font-medium border border-[#c3c6d7] text-[#191b23] hover:bg-[#f3f3fe] transition-colors duration-300 flex items-center justify-center gap-2">
                  <span>Explore NexClinic</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="relative reveal floating lg:h-[600px] flex items-center justify-center active">
              {/* Dashboard Preview Graphic */}
              <div className="glass-card w-full max-w-lg rounded-2xl p-6 relative z-10">
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
                  <div className="w-8 h-8 rounded-lg bg-[#6a1edb] text-white flex items-center justify-center shrink-0">
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
