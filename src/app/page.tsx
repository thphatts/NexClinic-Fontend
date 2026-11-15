import Link from 'next/link';

const journeys = [
  ['01', 'Chọn bác sĩ', 'Tìm hiểu chuyên khoa, kinh nghiệm và chi phí khám.', '/doctors'],
  ['02', 'Đặt lịch phù hợp', 'Chọn ngày, giờ còn trống và gửi yêu cầu khám.', '/appointments'],
  ['03', 'Theo dõi sức khỏe', 'Xem lịch hẹn và hồ sơ điều trị trong một không gian.', '/medical-records'],
];

export default function Home() {
  return <div className="min-h-screen bg-[#fafbf8] text-[#253b2e]">
    <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-6 sm:px-7">
      <Link href="/" className="brand-wordmark">nexclinic<span className="text-teal-700">.</span></Link>
      <nav aria-label="Điều hướng trang chủ" className="hidden gap-8 text-sm text-slate-500 md:flex"><a href="#care">Chăm sóc sức khỏe</a><a href="#journey">Cách đặt lịch</a><a href="#questions">Câu hỏi thường gặp</a></nav>
      <Link href="/login" className="btn-secondary">Đăng nhập</Link>
    </header>
    <main>
      <section className="public-section grid items-center gap-12 pt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div className="page-enter">
          <p className="eyebrow mb-6">MỘT KHÔNG GIAN, TRỌN VẸN CHĂM SÓC</p>
          <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">Sức khỏe của bạn.<br /><span className="text-[#759071]">Sự quan tâm<br />của chúng tôi.</span></h1>
          <p className="mt-7 max-w-md text-base leading-8 text-[#748071]">Kết nối với bác sĩ, đặt lịch khám và theo dõi hồ sơ sức khỏe. Nhẹ nhàng hơn, từ những bước đầu tiên.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/register" className="btn-primary">Bắt đầu chăm sóc</Link><Link href="/doctors" className="btn-secondary">Tìm hiểu bác sĩ</Link></div>
          <p className="mt-8 text-xs text-slate-500">Đặt lịch trực tuyến · Theo dõi hồ sơ · Kết nối bác sĩ</p>
        </div>
        <div className="hero-art" aria-label="Minh họa hành trình đặt lịch">
          <div className="mx-auto w-full max-w-[330px] rounded-2xl bg-white/95 p-7 shadow-[0_20px_60px_#506a4120]">
            <p className="eyebrow">DÀNH THỜI GIAN CHO BẠN</p><h2 className="mt-4 text-2xl font-medium tracking-tight">Một lịch hẹn.<br />Một khởi đầu tốt.</h2>
            <div className="my-7 border-y border-slate-100 py-5"><p className="text-xs text-slate-500">Hành trình khám bệnh</p><div className="mt-4 flex justify-between text-sm"><span>Chọn bác sĩ</span><span className="text-teal-700">01</span></div><div className="mt-4 flex justify-between text-sm"><span>Chọn thời gian</span><span className="text-teal-700">02</span></div><div className="mt-4 flex justify-between text-sm"><span>Gửi yêu cầu</span><span className="text-teal-700">03</span></div></div>
            <p className="text-xs leading-6 text-slate-500">Xem chi phí trước khi đặt.<br />Không cần thanh toán trước.</p>
          </div>
        </div>
      </section>
      <section id="care" className="border-y border-[#e4e9df] bg-white/70"><div className="public-section grid gap-8 md:grid-cols-3">
        {[
          ['Gần gũi hơn', 'Liên hệ trực tiếp với bác sĩ qua tin nhắn trong cổng thông tin.'],
          ['Rõ ràng hơn', 'Lịch hẹn, chi phí và hồ sơ được sắp xếp để dễ tìm, dễ theo dõi.'],
          ['Chủ động hơn', 'Trợ lý NexAI giúp bạn chuẩn bị câu hỏi và tìm hiểu trước buổi khám.'],
        ].map(([title, body]) => <div key={title}><h2 className="mb-3 text-lg font-medium">{title}</h2><p className="max-w-xs text-sm leading-7 text-slate-500">{body}</p></div>)}
      </div></section>
      <section id="journey" className="public-section"><p className="eyebrow">THẬT DỄ ĐỂ BẮT ĐẦU</p><h2 className="display-heading mt-4 text-4xl sm:text-5xl">Chăm sóc, từng bước một.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{journeys.map(([number, title, body, href]) => <Link key={number} href={href} className="clinic-panel interactive-lift p-7"><span className="text-sm text-[#899e7e]">{number}</span><h3 className="mb-3 mt-8 text-xl font-medium">{title}</h3><p className="text-sm leading-7 text-slate-500">{body}</p><p className="mt-7 text-xs font-medium text-teal-800">Khám phá →</p></Link>)}</div>
      </section>
      <section id="questions" className="public-section grid gap-10 border-t border-[#e4e9df] md:grid-cols-2"><div><p className="eyebrow">GIẢI ĐÁP NHANH</p><h2 className="display-heading mt-4 text-4xl">Bạn đang băn khoăn?</h2></div><div className="space-y-3">{[
        ['Tôi cần tài khoản để đặt lịch không?', 'Bạn cần đăng nhập và có hồ sơ bệnh nhân để đặt và theo dõi lịch của mình.'],
        ['Có cần thanh toán khi đặt lịch?', 'Bạn có thể xem tổng phí trước khi gửi yêu cầu. Đặt lịch không yêu cầu thanh toán trước.'],
        ['NexAI có thay thế buổi khám không?', 'NexAI hỗ trợ tham khảo và chuẩn bị thông tin. Bác sĩ sẽ thăm khám và đưa ra hướng dẫn phù hợp.'],
      ].map(([question, answer]) => <details key={question} className="group border-b border-[#e4e9df] pb-4"><summary className="cursor-pointer py-3 text-sm font-medium">{question}</summary><p className="page-enter pb-2 text-sm leading-7 text-slate-500">{answer}</p></details>)}</div></section>
    </main>
    <footer className="public-section flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e9df] !py-8"><span className="brand-wordmark">nexclinic.</span><p className="text-xs text-slate-500">Chăm sóc từ những điều nhỏ.</p><Link href="/login" className="text-xs text-teal-800">Đến cổng thông tin →</Link></footer>
  </div>;
}
