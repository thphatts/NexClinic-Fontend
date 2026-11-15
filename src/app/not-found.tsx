import Link from 'next/link';

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#f7f8f5] p-6"><div className="text-center"><p className="eyebrow">404 / KHÔNG TÌM THẤY</p><h1 className="mt-5 text-3xl font-medium">Có vẻ bạn đã đi lạc.</h1><p className="my-5 text-sm text-slate-500">Trang này không tồn tại hoặc đã được di chuyển.</p><Link href="/dashboard" className="btn-primary">Về tổng quan</Link></div></main>;
}
