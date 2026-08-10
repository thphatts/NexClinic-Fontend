'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signed in as: ${email}`);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen w-full overflow-hidden flex font-sans antialiased">
      {/* Material Symbols Outlined Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      {/* Left Side: Branding & Image */}
      <div className="hidden lg:flex w-1/2 h-full bg-white relative items-center justify-center border-r border-[#c3c6d7]">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-80 mix-blend-multiply"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqe1Ct7KEZo_DKi7aQm_eHAryozA9NXhs2x8UDK4DCL9FgqvqhTJr7Z6p6vHro3TL_4meOl2gkliYr8Z6q2A7YMHovdsZog7or-oSRlltAYWHe0r-rKJLnMtE-TbulsnXlTo15OJ7iToQz0COBmjGvHhcAWxgHzZtxc4lG7oDP-zxfS1Z2ixmXdlMGfPDw6zVIms3-t4jM7-DvfMMrB2WAVu2iTvwUrZGUeknkR_WmK9lp-Vg-eGt9')",
            }}
          ></div>
        </div>
        <div className="z-10 flex flex-col items-start px-8 max-w-lg">
          <div className="flex items-center gap-2 mb-6">
            <span
              className="material-symbols-outlined text-[#004ac6] text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              medical_services
            </span>
            <h1 className="text-3xl font-bold text-[#004ac6]">NexClinic</h1>
          </div>
          <p className="text-2xl font-semibold text-[#434655] mb-4">Advancing Clinical Management.</p>
          <p className="text-sm text-[#434655] max-w-md leading-relaxed">
            Streamline your practice with high-density data visualization, secure patient records, and intelligent appointment scheduling.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center bg-white px-6 relative">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8 absolute top-6 left-6">
          <span
            className="material-symbols-outlined text-[#004ac6] text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            medical_services
          </span>
          <span className="text-2xl font-bold text-[#004ac6]">NexClinic</span>
        </div>

        <div className="w-full max-w-[400px] bg-white border border-[#c3c6d7] rounded-xl p-8 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#191c1e] mb-1">Sign In</h2>
            <p className="text-sm text-[#434655]">Enter your credentials to access the portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#191c1e] mb-1" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <input
                  className="block w-full h-[38px] px-3 rounded border border-[#c3c6d7] bg-white text-[#191c1e] focus:border-transparent focus:ring-2 focus:ring-[#004ac6] focus:outline-none transition-shadow text-sm placeholder:text-[#737686]"
                  id="email"
                  name="email"
                  placeholder="doctor@nexclinic.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#737686] text-[20px]">mail</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-[#191c1e]" htmlFor="password">
                  Password
                </label>
                <a className="text-[13px] text-[#004ac6] hover:text-[#003ea8] transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  className="block w-full h-[38px] px-3 rounded border border-[#c3c6d7] bg-white text-[#191c1e] focus:border-transparent focus:ring-2 focus:ring-[#004ac6] focus:outline-none transition-shadow text-sm placeholder:text-[#737686]"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737686] hover:text-[#191c1e] transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6] bg-white"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label className="ml-2 block text-sm text-[#434655]" htmlFor="remember-me">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full h-[40px] flex justify-center items-center rounded-lg bg-[#004ac6] text-white font-medium text-sm hover:bg-[#003ea8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004ac6] transition-colors shadow-sm"
              type="submit"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#c3c6d7] text-center">
            <p className="text-sm text-[#434655]">
              Need technical support?{' '}
              <a className="text-[#004ac6] font-medium hover:underline" href="#">
                Contact IT Helpdesk
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center w-full max-w-[400px]">
          <p className="text-[11px] text-[#737686] uppercase tracking-wider font-bold">
            © 2024 NexClinic Systems. Secure Environment.
          </p>
        </div>
      </div>
    </div>
  );
}
