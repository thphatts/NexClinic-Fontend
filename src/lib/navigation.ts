import type { Role } from '@/types/api';

export const navigation: { label: string; href: string; group: string; description: string; roles?: Role[] }[] = [
  { label: 'Tổng quan', href: '/dashboard', group: 'Không gian làm việc', description: 'Một ngày mới, mọi việc trong tầm tay.' },
  { label: 'Lịch hẹn', href: '/appointments', group: 'Chăm sóc', description: 'Sắp xếp lịch khám, dành thời gian cho sức khỏe.' },
  { label: 'Đang khám', href: '/visits', group: 'Chăm sóc', description: 'Theo dõi lượt khám đang mở tại phòng khám.', roles: ['ROLE_ADMIN', 'ROLE_RECEPTIONIST', 'ROLE_STAFF', 'ROLE_DOCTOR'] },
  { label: 'Bác sĩ', href: '/doctors', group: 'Chăm sóc', description: 'Tìm người đồng hành phù hợp với nhu cầu của bạn.' },
  { label: 'Bệnh nhân', href: '/patients', group: 'Chăm sóc', description: 'Thông tin cần thiết để chăm sóc từng người tốt hơn.', roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'] },
  { label: 'Hồ sơ bệnh án', href: '/medical-records', group: 'Chăm sóc', description: 'Theo dõi từng bước trong hành trình điều trị.', roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'] },
  { label: 'Đơn thuốc', href: '/prescriptions', group: 'Chăm sóc', description: 'Tra cứu hướng dẫn và thông tin sử dụng thuốc.', roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'] },
  { label: 'Tin nhắn', href: '/chat', group: 'Kết nối', description: 'Giữ kết nối với người chăm sóc sức khỏe của bạn.', roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'] },
  { label: 'Trợ lý NexAI', href: '/ai', group: 'Kết nối', description: 'Thêm một góc nhìn để chuẩn bị tốt hơn cho buổi khám.' },
  { label: 'Kho thuốc', href: '/products', group: 'Quản lý', description: 'Danh mục thuốc và vật tư của phòng khám.', roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'] },
  { label: 'Thanh toán', href: '/payments', group: 'Quản lý', description: 'Theo dõi chi phí và thanh toán lịch khám.', roles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_PATIENT'] },
  { label: 'Tài khoản', href: '/users', group: 'Quản lý', description: 'Quản lý thành viên và quyền truy cập.', roles: ['ROLE_ADMIN'] },
  { label: 'Cài đặt', href: '/settings', group: 'Quản lý', description: 'Điều chỉnh không gian làm việc theo cách của bạn.', roles: ['ROLE_ADMIN'] },
];

export const roleLabels: Record<string, string> = {
  ROLE_ADMIN: 'Quản trị viên', ROLE_DOCTOR: 'Bác sĩ', ROLE_STAFF: 'Lễ tân', ROLE_RECEPTIONIST: 'Lễ tân', ROLE_NURSE: 'Điều dưỡng', ROLE_PATIENT: 'Bệnh nhân',
};
