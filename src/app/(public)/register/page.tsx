'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

const fields = [
  { name: 'name', label: 'Họ và tên', type: 'text', required: true, auto: 'name' },
  { name: 'username', label: 'Tên đăng nhập', type: 'text', required: true, auto: 'username' },
  { name: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
  { name: 'password', label: 'Mật khẩu (ít nhất 6 ký tự)', type: 'password', required: true, auto: 'new-password' },
  { name: 'phone', label: 'Số điện thoại', type: 'tel', required: true, auto: 'tel' },
  { name: 'dob', label: 'Ngày sinh', type: 'date', required: true, auto: 'bday' },
  { name: 'citizenId', label: 'Căn cước công dân', type: 'text', required: true, auto: 'off' },
  { name: 'address', label: 'Địa chỉ', type: 'text', auto: 'street-address' },
] as const;

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', username: '', email: '', password: '', phone: '', dob: '', citizenId: '', address: '', gender: 'MALE' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null);
    const phone = data.phone.trim();
    if (!phone) { setError('Số điện thoại không được để trống.'); return; }
    const citizenId = data.citizenId.trim();
    if (!/^\d{12}$/.test(citizenId)) { setError('Số căn cước công dân cần đủ 12 chữ số.'); return; }
    setLoading(true);
    try {
      const result = await authService.register({ ...data, name: data.name.trim(), username: data.username.trim(), email: data.email.trim(), phone, address: data.address.trim() || undefined, dob: data.dob, citizenId });
      setAuth(result); router.replace('/dashboard');
    } catch { setError('Không thể tạo tài khoản. Kiểm tra thông tin hoặc thử lại sau.'); setLoading(false); }
  };
  return <AuthShell>
    <p className="eyebrow">BẮT ĐẦU TỪ HÔM NAY</p><h1 className="mt-3 text-3xl font-medium tracking-tight">Tạo tài khoản</h1><p className="mb-7 mt-3 text-sm text-slate-500">Một vài thông tin để kết nối với phòng khám.</p>
    {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    <form onSubmit={submit} className="space-y-5"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => <div key={field.name}><label htmlFor={field.name} className="field-label">{field.label}{'required' in field && <span className="text-teal-700"> *</span>}</label><input id={field.name} name={field.name} type={field.type} autoComplete={field.auto} required={'required' in field} minLength={field.name === 'password' ? 6 : undefined} maxLength={field.name === 'citizenId' ? 12 : undefined} pattern={field.name === 'citizenId' ? '[0-9]{12}' : undefined} inputMode={field.name === 'citizenId' ? 'numeric' : undefined} title={field.name === 'citizenId' ? 'CCCD phải gồm đúng 12 chữ số' : undefined} value={data[field.name]} onChange={(event) => setData({ ...data, [field.name]: event.target.value })} className="field-input" /></div>)}
      <div><label htmlFor="gender" className="field-label">Giới tính</label><select id="gender" className="field-input" value={data.gender} onChange={(event) => setData({ ...data, gender: event.target.value })}><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option></select></div>
    </div><p className="text-xs text-slate-400">Các trường có dấu * là bắt buộc.</p><button disabled={loading} className="btn-primary w-full">{loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}</button></form>
    <p className="mt-6 text-center text-sm text-slate-500">Đã có tài khoản? <Link href="/login" className="font-medium text-teal-800">Đăng nhập</Link></p>
  </AuthShell>;
}
