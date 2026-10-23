import React from 'react';
import { X, BookOpen, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span>Luật Chơi Cờ Caro & Bí Quyết Chiến Thắng</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-stone-700 leading-relaxed">
          {/* Section 1: Basic Rules */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Mục tiêu cơ bản
            </h3>
            <p>
              Hai bên luân phiên đặt quân cờ của mình (<strong className="text-blue-600">X</strong> hoặc{' '}
              <strong className="text-rose-600">O</strong>) lên các giao điểm trống trên bàn cờ. Người chơi đầu tiên xếp được một hàng{' '}
              <strong>5 quân thẳng hàng</strong> (theo chiều ngang, dọc hoặc chéo) sẽ giành chiến thắng.
            </p>
          </div>

          {/* Section 2: Vietnam Rule vs Freestyle */}
          <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80">
            <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" /> 2. Phân biệt 2 luật chơi quan trọng
            </h3>
            <ul className="space-y-2 text-stone-800">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-800 shrink-0">• Luật Chuẩn Việt Nam (Chặn 2 đầu):</span>
                <span>
                  Nếu bạn xếp đủ 5 quân liên tiếp nhưng <strong>cả hai đầu đều bị quân đối phương chặn lại</strong> (ví dụ: <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">O X X X X X O</code>) thì <strong>chưa được tính là thắng</strong>! Bạn phải có ít nhất 1 đầu thông thoáng hoặc tạo thế cờ khác.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-800 shrink-0">• Luật Quốc Tế (Tự do 5+):</span>
                <span>
                  Cứ nối đủ 5 quân hoặc nhiều hơn liên tiếp là thắng ngay, không phân biệt việc có bị chặn 2 đầu hay không.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Winning Strategies */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> 3. Bí quyết & Thế cờ kinh điển
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="font-bold text-stone-900 mb-1">Thế 4 hở hai đầu (Open 4)</div>
                <p className="text-stone-600">
                  Thế cờ có 4 quân và 2 đầu đều trống. Đối phương chỉ có thể chặn 1 đầu ở lượt sau, bạn sẽ đánh vào đầu còn lại để thắng tuyệt đối.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="font-bold text-stone-900 mb-1">Thế đôi 3 (Double Three)</div>
                <p className="text-stone-600">
                  Tạo cùng lúc 2 chuỗi 3 quân mở. Khi bạn nâng 1 chuỗi lên thế 4, đối phương chặn thì bạn nâng chuỗi còn lại lên thế 4 để thắng.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="font-bold text-stone-900 mb-1">Chiếm giữ trung tâm</div>
                <p className="text-stone-600">
                  Nước đi đầu tiên tại ô trung tâm (Tengen) mang lại khả năng phát triển quân về mọi hướng tối đa.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="font-bold text-stone-900 mb-1">Tiên hạ thủ vi cường</div>
                <p className="text-stone-600">
                  Luôn tính trước 2-3 nước cờ. Khi thấy đối phương có thế 3 mở hoặc 4 quân, phải chặn ngay lập tức!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Đã hiểu, quay lại chơi
          </button>
        </div>
      </div>
    </div>
  );
};
