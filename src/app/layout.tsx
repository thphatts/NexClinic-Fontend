import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { FeedbackProvider } from '@/providers/FeedbackProvider';

export const metadata: Metadata = {
  title: "NexClinic — Không gian chăm sóc sức khỏe",
  description: "Đặt lịch khám, kết nối bác sĩ và theo dõi hồ sơ sức khỏe cùng NexClinic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen text-slate-900 antialiased">
        <QueryProvider>
          <LanguageProvider><FeedbackProvider>{children}</FeedbackProvider></LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
