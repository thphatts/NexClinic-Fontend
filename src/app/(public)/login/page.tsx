'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); setError(null);
    try { setAuth(await authService.login({ username: username.trim(), password })); router.replace('/dashboard'); }
    catch { setError('Không thể đăng nhập. Kiểm tra tài khoản, mật khẩu hoặc thử lại sau.'); setLoading(false); }
  };
  return <AuthShell>
    <p className="eyebrow">CHÀO MỪNG BẠN TRỞ LẠI</p><h1 className="mt-3 text-3xl font-medium tracking-tight">Đăng nhập</h1><p className="mb-9 mt-3 text-sm leading-6 text-slate-500">Tiếp tục hành trình chăm sóc sức khỏe của bạn.</p>
    {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    <form onSubmit={submit} className="space-y-5">
      <div><label htmlFor="username" className="field-label">Tên đăng nhập hoặc email</label><input id="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="field-input" placeholder="Nhập tài khoản của bạn" /></div>
      <div><label htmlFor="password" className="field-label">Mật khẩu</label><div className="relative"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="field-input pr-16" placeholder="Nhập mật khẩu" /><button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-xs text-slate-500">{showPassword ? 'Ẩn' : 'Hiện'}</button></div></div>
      <button disabled={loading} className="btn-primary w-full !mt-7">{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
    </form>
    <p className="mt-7 text-center text-sm text-slate-500">Chưa có tài khoản? <Link href="/register" className="font-medium text-teal-800">Đăng ký</Link></p>
    <Link href="/" className="mt-10 block text-center text-xs text-slate-400 hover:text-teal-800">Quay về trang chủ</Link>
  </AuthShell>;
}
