import Link from 'next/link';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <main className="auth-shell">
    <aside className="auth-story">
      <Link href="/" className="brand-wordmark relative z-10">nexclinic.</Link>
      <div className="relative z-10"><p className="eyebrow mb-6">CHĂM SÓC TỪ NHỮNG ĐIỀU NHỎ</p><h2>Một nơi để<br />an tâm hơn.</h2><p className="mt-6 max-w-xs text-sm leading-7 text-[#6f806b]">Lịch khám, hồ sơ và người đồng hành. Luôn ở đây, khi bạn cần.</p></div>
      <p className="relative z-10 hidden text-xs text-[#6f806b] md:block">Không gian chăm sóc sức khỏe của bạn.</p>
      <div className="auth-orbit" aria-hidden="true" />
    </aside>
    <section className="flex items-center justify-center px-6 py-12 sm:px-12"><div className="page-enter w-full max-w-md">{children}</div></section>
  </main>;
}
