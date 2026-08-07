'use client';

import Link from "next/link";
import { Stethoscope, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Đăng nhập NexClinic</h1>
          <p className="mt-1 text-sm text-slate-400">Nhập thông tin tài khoản để truy cập hệ thống</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-slate-300">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              placeholder="admin / doctor / patient"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/25"
          >
            <Lock className="h-4 w-4" /> Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-blue-400 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
