'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="grid min-h-[70dvh] place-items-center bg-[#f7f8f5] p-6"><div className="max-w-md text-center"><p className="eyebrow">NEXCLINIC</p><h1 className="mt-5 text-3xl font-medium">Trang chưa thể hiển thị</h1><p className="my-5 text-sm leading-7 text-slate-500">Đã có lỗi khi tải nội dung. Hãy thử lại để tiếp tục.</p><button onClick={reset} className="btn-primary">Thử lại</button></div></main>;
}
