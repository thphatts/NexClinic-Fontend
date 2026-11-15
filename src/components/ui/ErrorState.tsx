import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Chưa thể tải dữ liệu',
  message = 'Vui lòng kiểm tra kết nối và thử lại.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50/50 rounded-3xl border border-rose-100">
      <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition shadow-sm"
        >
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
};
