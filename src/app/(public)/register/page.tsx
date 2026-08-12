"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Loader2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dob: "",
    gender: "MALE",
    citizenId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Validate Citizen ID (CCCD) if entered
    if (formData.citizenId && !/^\d{12}$/.test(formData.citizenId)) {
      setError("Số CCCD phải có đủ 12 chữ số hợp lệ");
      setLoading(false);
      return;
    }

    try {
      const authRes = await authService.register({
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        dob: formData.dob || undefined,
        gender: formData.gender,
        citizenId: formData.citizenId.trim() || undefined,
      });

      setSuccessMsg("Đăng ký tài khoản thành công! Đang chuyển hướng...");
      setAuth(authRes);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj.response?.data?.message ||
          errorObj.message ||
          "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen w-full flex items-center justify-center font-sans antialiased p-4 py-8">
      <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Đăng nhập</span>
          </Link>
          <div className="text-xs text-slate-400">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-400 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>

        {/* Brand Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-blue-500/20">
            ✦
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-xs text-slate-400">
            Đăng ký để trải nghiệm cổng thông tin khám chữa bệnh AI NexClinic
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Họ và Tên <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tên đăng nhập (Username) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="nguyenvana"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nguyenvana@example.com"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Mật khẩu (ít nhất 6 ký tự) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Số điện thoại
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Citizen ID (CCCD) */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Số CCCD (12 chữ số)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="citizenId"
                  maxLength={12}
                  value={formData.citizenId}
                  onChange={handleChange}
                  placeholder="001200300400"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                />
                <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Ngày sinh
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition [color-scheme:dark]"
                />
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Địa chỉ liên hệ
            </label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
              />
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý đăng ký...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Tạo Tài Khoản</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
