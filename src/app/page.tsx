import Link from "next/link";
import { Stethoscope, Bot, Calendar, ShieldCheck, UserCheck, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NexClinic</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Tính năng
            </Link>
            <Link href="#ai-assistant" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Trợ lý AI
            </Link>
            <Link href="#doctors" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Đội ngũ Bác sĩ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-500 shadow-blue-600/20"
            >
              Đăng ký khám
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 lg:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Bot className="h-4 w-4" /> Powered by Gemini AI Assistant & RAG
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Nền tảng Quản lý Phòng khám Thông minh <span className="text-blue-500">NexClinic</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400 max-w-3xl mx-auto">
            Hệ thống cổng thông tin y tế toàn diện tích hợp đặt lịch hẹn trực tuyến, hồ sơ bệnh án điện tử 
            và trợ lý ảo tư vấn sức khỏe AI 24/7.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/appointments/new"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-blue-500 shadow-blue-600/30"
            >
              <Calendar className="h-5 w-5" /> Đặt lịch hẹn ngay
            </Link>
            <Link
              href="/ai-chat"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              <Bot className="h-5 w-5 text-blue-400" /> Hỏi đáp Bác sĩ AI
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-slate-800 bg-slate-950 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tính năng nổi bật</h2>
            <p className="mt-4 text-slate-400">Được tối ưu hóa riêng cho từng vai trò người dùng</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-6">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Trợ lý Y tế AI Gemini</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Tư vấn triệu chứng ban đầu, phân tích đơn thuốc và tìm kiếm tri thức y khoa dựa trên công nghệ Vector Database RAG.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Bảo mật Phân quyền 4 Lớp</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Phân quyền sở hữu dữ liệu chặt chẽ cho Admin, Bác sĩ, Lễ tân và Bệnh nhân. Mã hóa và bảo vệ thông tin bệnh án tuyệt đối.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-6">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Thanh toán VNPay & Lịch hẹn</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Thanh toán phí khám online nhanh chóng qua cổng VNPay Sandbox, chống trùng lịch khám tự động bằng thuật toán khóa khe giờ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-sm text-slate-500">
        © 2026 NexClinic Portal. All rights reserved.
      </footer>
    </div>
  );
}
