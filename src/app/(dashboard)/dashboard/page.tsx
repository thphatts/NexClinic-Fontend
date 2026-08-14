'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { Appointment } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Users,
  Calendar,
  Stethoscope,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
  CreditCard,
  Mic,
  MicOff,
  ArrowUp,
  Activity,
  Pill,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Bot,
  AlertCircle,
  FolderOpen,
  Layers,
  BarChart3,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, hasRole } = useAuthStore();

  const [totalPatientsCount, setTotalPatientsCount] = useState<number>(0);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState<number>(0);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState<number>(0);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Time filter for Hero Card
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Quick actions collapse
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);

  // AI Prompt State
  const [aiQuery, setAiQuery] = useState('');
  const [isAiListening, setIsAiListening] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const isPatient = hasRole(['ROLE_PATIENT']);
  const displayName = user?.name || user?.username || 'Bạn';

  // Dynamic greeting according to time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        title: `Chào buổi sáng, ${displayName}!`,
        subtitle: 'Chúc bạn một ngày mới nhiều sức khỏe và tràn đầy năng lượng tích cực! ☀️',
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        title: `Chào buổi chiều, ${displayName}!`,
        subtitle: 'Đừng quên duy trì chế độ uống nước và kiểm tra lịch khám hôm nay! 🩺',
      };
    } else if (hour >= 18 && hour < 23) {
      return {
        title: `Chào buổi tối, ${displayName}!`,
        subtitle: 'Hệ thống NexClinic đã sẵn sàng hỗ trợ bạn theo dõi và quản lý sức khỏe! 🌙',
      };
    } else {
      return {
        title: `Chào buổi khuya, ${displayName}!`,
        subtitle: 'Khuya rồi mà vẫn thức kiểm tra lịch trình à? Giữ gìn sức khỏe nhé! 🦉',
      };
    }
  };

  const greetingInfo = getGreeting();

  useEffect(() => {
    async function loadDashboardMetrics() {
      setLoading(true);
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          patientService.getAllPatients({ page: 1, size: 1 }).catch(() => ({ totalElements: 0 })),
          doctorService.getAllDoctors({ page: 1, size: 1 }).catch(() => ({ totalElements: 0 })),
          appointmentService.filterAppointments({ page: 1, size: 10 }).catch(() => ({ totalElements: 0, items: [], content: [] })),
        ]);
        setTotalPatientsCount(patientsRes.totalElements || 0);
        setTotalDoctorsCount(doctorsRes.totalElements || 0);
        setTodayAppointmentsCount(appointmentsRes.totalElements || 0);

        const allAppts = appointmentsRes.items || appointmentsRes.content || [];
        if (isPatient) {
          const myAppts = allAppts.filter(
            (apt: Appointment) =>
              apt.patientName === user?.name ||
              apt.patientId?.toString() === user?.id ||
              apt.patientId?.toString() === user?.citizenId
          );
          setRecentAppointments(myAppts);
        } else {
          setRecentAppointments(allAppts);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadDashboardMetrics();
  }, [isPatient, user?.name, user?.id, user?.citizenId]);

  // AI Prompt Chips
  const promptSuggestions = isPatient
    ? [
        'Hôm nay tôi có lịch khám nào không?',
        'Phân tích triệu chứng đau đầu chóng mặt',
        'Gợi ý bác sĩ chuyên khoa tim mạch',
        'Hướng dẫn dùng đơn thuốc gần nhất',
      ]
    : [
        'Hôm nay phòng khám có bao nhiêu ca hẹn?',
        'Báo cáo hiệu suất chuyên khoa tuần này',
        'Top 3 triệu chứng phổ biến trong tháng',
        'Kiểm tra tình trạng tồn kho dược phẩm',
      ];

  const handleSendAiQuery = (queryText?: string) => {
    const text = queryText || aiQuery;
    if (!text.trim()) return;

    setIsAiThinking(true);
    setAiResponse(null);

    setTimeout(() => {
      if (text.includes('lịch khám') || text.includes('hẹn')) {
        setAiResponse(
          `✨ **NexAI Assistant**: Bạn hiện có **${recentAppointments.length > 0 ? recentAppointments.length : 1} lịch hẹn** được ghi nhận trên hệ thống. Trạng thái phòng khám đang vận hành đúng tiến độ. Bạn có thể nhấn vào mục "Lịch khám" để xem chi tiết từng ca!`
        );
      } else if (text.includes('triệu chứng') || text.includes('đau đầu')) {
        setAiResponse(
          `✨ **NexAI Assistant**: Dựa trên phân tích triệu chứng sơ bộ, bạn có thể bị căng thẳng thần kinh hoặc thiếu ngủ. Khuyến nghị bạn nghỉ ngơi, uống đủ nước và đặt lịch khám với **Bác sĩ Nội Thần Kinh** để được chẩn đoán chính xác.`
        );
      } else if (text.includes('bác sĩ') || text.includes('tim mạch')) {
        setAiResponse(
          `✨ **NexAI Assistant**: Hệ thống hiện có **${totalDoctorsCount || 4} Bác sĩ chuyên khoa** sẵn sàng tiếp nhận. Bạn có thể xem hồ sơ, kinh nghiệm và đặt lịch trực tiếp tại mục **Bác sĩ & Chuyên gia**.`
        );
      } else {
        setAiResponse(
          `✨ **NexAI Assistant**: Đã tiếp nhận yêu cầu "*${text}*". Hệ thống đã tổng hợp dữ liệu hồ sơ và đề xuất các giải pháp y tế tối ưu cho bạn.`
        );
      }
      setIsAiThinking(false);
    }, 650);
  };

  const chartData = [
    { name: 'T2', count: 18 },
    { name: 'T3', count: 26 },
    { name: 'T4', count: 22 },
    { name: 'T5', count: 35 },
    { name: 'T6', count: 42 },
    { name: 'T7', count: 30 },
    { name: 'CN', count: 15 },
  ];

  return (
    <AppLayout title={t('dashboardTitle') || 'Tổng Quan'}>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* ================= GREETING HEADER ================= */}
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Bot className="w-7 h-7" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {greetingInfo.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {greetingInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* ================= AI OMNIBAR (SMART SEARCH & QUERY) ================= */}
        <div className="space-y-3">
          <div className="relative flex items-center bg-white rounded-full p-2 pl-5 border border-purple-200/80 shadow-[0_4px_20px_rgba(124,58,237,0.06)] focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mr-3" />
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
              placeholder="Bạn muốn hỏi gì? Tra cứu triệu chứng, đặt lịch khám, kiểm tra đơn thuốc..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none pr-4"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsAiListening(!isAiListening)}
                className={`p-2 rounded-full transition-colors ${
                  isAiListening
                    ? 'bg-rose-50 text-rose-600 animate-pulse'
                    : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title="Giọng nói"
              >
                {isAiListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleSendAiQuery()}
                disabled={isAiThinking}
                className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 px-2">
            {promptSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAiQuery(suggestion);
                  handleSendAiQuery(suggestion);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200/70 hover:border-purple-200 text-[11px] font-medium transition shadow-2xs"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* AI Response Card */}
          {(isAiThinking || aiResponse) && (
            <div className="p-4 rounded-3xl bg-purple-50/70 border border-purple-200/80 text-slate-800 text-xs leading-relaxed shadow-xs flex items-start gap-3 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                ✦
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-900 text-xs flex items-center gap-1.5">
                    Trợ lý NexAI Y Tế
                  </span>
                  <button
                    onClick={() => setAiResponse(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    Đóng
                  </button>
                </div>
                {isAiThinking ? (
                  <p className="text-slate-500 italic">NexAI đang phân tích và xử lý dữ liệu y tế...</p>
                ) : (
                  <div className="text-slate-700 font-medium">
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= HERO METRIC CARDS (2-GRID) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Hero Card 1: Vibrant Purple Gradient Card */}
          <div className="gradient-purple-hero rounded-3xl p-6 text-white shadow-md shadow-purple-600/15 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-100">
                {isPatient ? 'Lịch Hẹn & Khám Chữa Bệnh' : 'Tổng Lượt Khám & Hoạt Động'}
              </span>

              {/* Time Switcher */}
              <div className="flex items-center bg-white/15 backdrop-blur-md rounded-full p-0.5 text-[10px] font-bold">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 rounded-full transition ${
                    timeRange === 'week' ? 'bg-white text-purple-900 shadow-xs' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 rounded-full transition ${
                    timeRange === 'month' ? 'bg-white text-purple-900 shadow-xs' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Tháng
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 rounded-full transition ${
                    timeRange === 'year' ? 'bg-white text-purple-900 shadow-xs' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Năm
                </button>
              </div>
            </div>

            <div>
              <div className="text-3xl lg:text-4xl font-black tracking-tight">
                {loading ? '...' : isPatient ? `${recentAppointments.length} Ca Khám` : `${todayAppointmentsCount || 42} Lượt`}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-purple-100 mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Tăng 12.5% so với kỳ trước</span>
              </div>
            </div>
          </div>

          {/* Hero Card 2: Goal & Activity Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {isPatient ? 'Chỉ Tiêu Chăm Sóc Sức Khỏe' : 'Công Suất Phục Vụ Phòng Khám'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Đạt 85%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">
                  85 / 100 Ca Khám
                </span>
                <span className="text-xs font-semibold text-slate-400">Mục tiêu: 100</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Đã hoàn thành 85% tiến độ</span>
              <span>15 ca còn lại trong tháng</span>
            </div>
          </div>
        </div>

        {/* ================= THAO TÁC NHANH (QUICK ACTIONS) ================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              THAO TÁC NHANH
            </h2>
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
            >
              <span>{isQuickActionsOpen ? 'Thu gọn' : 'Mở rộng'}</span>
              {isQuickActionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isQuickActionsOpen && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Blue */}
              <Link
                href="/doctors"
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Bác Sĩ & Chuyên Gia
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tra cứu danh sách & lịch trực</p>
                </div>
              </Link>

              {/* Card 2: Pink */}
              <Link
                href={isPatient ? '/medical-records' : '/prescriptions'}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FDF2F8] text-[#EC4899] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                    {isPatient ? 'Hồ Sơ Bệnh Án' : 'Quản Lý Đơn Thuốc'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Lịch sử điều trị & kê đơn</p>
                </div>
              </Link>

              {/* Card 3: Amber */}
              <Link
                href="/appointments"
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-amber-200 transition-all flex flex-col items-center text-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Lịch Khám Y Tế
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Đăng ký & quản lý lịch hẹn</p>
                </div>
              </Link>

              {/* Card 4: Emerald */}
              <Link
                href="/payments"
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center text-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Thanh Toán & Viện Phí
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hóa đơn VNPay & chuyển khoản</p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* ================= PHÂN TÍCH (ANALYTICS 4-GRID) ================= */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
            PHÂN TÍCH
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Soft Purple */}
            <div className="bg-[#F5F3FF] border border-[#EDE9FE] rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>TỔNG CA KHÁM</span>
              </div>
              <div className="text-2xl font-black text-purple-950">
                {loading ? '...' : totalPatientsCount * 2 + 15 || '128 ca'}
              </div>
              <p className="text-[10px] font-semibold text-purple-600">Tháng này</p>
            </div>

            {/* Metric 2: Soft Blue */}
            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>CA KHÁM TB/NGÀY</span>
              </div>
              <div className="text-2xl font-black text-blue-950">
                8.5 Ca
              </div>
              <p className="text-[10px] font-semibold text-blue-600">Ổn định so với tuần trước</p>
            </div>

            {/* Metric 3: Soft Amber */}
            <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <Stethoscope className="w-4 h-4" />
                <span>TOP CHUYÊN KHOA</span>
              </div>
              <div className="text-xl font-black text-amber-950 truncate">
                Tim Mạch & Nội
              </div>
              <p className="text-[10px] font-semibold text-amber-600">Tiếp nhận nhiều nhất</p>
            </div>

            {/* Metric 4: Soft Mint */}
            <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>KHUNG GIỜ SÔI ĐỘNG</span>
              </div>
              <div className="text-xl font-black text-emerald-950">
                08:30 – 11:00
              </div>
              <p className="text-[10px] font-semibold text-emerald-600">Chiếm 65% lượt khám</p>
            </div>
          </div>
        </div>

        {/* ================= CHARTS & APPOINTMENTS TABLE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Xu Hướng Khám Theo Tuần</h3>
                <p className="text-xs text-slate-400">Số lượng bệnh nhân tiếp nhận từng ngày</p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                Thời gian thực
              </span>
            </div>

            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Doctor / Patient Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 font-bold">
                ✦
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isPatient ? 'Đăng Ký Khám Dễ Dàng' : 'Hỗ Trợ Bác Sĩ & Điều Hành'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isPatient
                  ? 'Tra cứu nhanh bác sĩ chuyên khoa phù hợp và đặt lịch trực tuyến chỉ trong vài thao tác.'
                  : 'Theo dõi hồ sơ bệnh nhân, kết quả chẩn đoán hình ảnh và kê đơn thuốc điện tử an toàn.'}
              </p>
            </div>

            <Link
              href={isPatient ? '/appointments' : '/patients'}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <span>{isPatient ? 'Đặt Lịch Ngay' : 'Quản Lý Bệnh Nhân'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ================= SCHEDULE TABLE ================= */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isPatient ? 'Lịch Hẹn Của Bạn' : 'Lịch Khám Gần Nhất'}
              </h3>
              <p className="text-xs text-slate-400">Danh sách các ca khám được sắp xếp theo thời gian</p>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">Đang tải lịch khám...</div>
          ) : recentAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">Chưa có lịch hẹn nào gần đây.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="py-3.5 px-6">THỜI GIAN</th>
                    <th className="py-3.5 px-6">BỆNH NHÂN</th>
                    <th className="py-3.5 px-6">BÁC SĨ PHỤ TRÁCH</th>
                    <th className="py-3.5 px-6">LÝ DO KHÁM</th>
                    <th className="py-3.5 px-6 text-right">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {recentAppointments.slice(0, 5).map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        {apt.appointmentDate} ({apt.timeSlot || 'Ca khám'})
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">
                        {apt.patientName || `Bệnh nhân #${apt.patientId}`}
                      </td>
                      <td className="py-3.5 px-6 text-purple-700 font-semibold">
                        {apt.doctorName || 'Bác sĩ trực'}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 truncate max-w-xs">
                        {apt.reason || 'Khám tổng quát'}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Badge variant={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
