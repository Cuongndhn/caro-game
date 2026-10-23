# 🎮 Cờ Caro Việt (Gomoku Pro)

Ứng dụng web chơi cờ Caro (Gomoku) trực tuyến được xây dựng với React 19, TypeScript, Tailwind CSS và Web Audio API. 

Hỗ trợ chơi với Máy AI thông minh đa cấp độ, chơi 2 người trên cùng thiết bị, luật chặn 2 đầu chuẩn Việt Nam và giao diện bàn cờ gỗ tự nhiên chân thực.

![Caro Preview](src/assets/images/caro_wood_texture_1792721757395.jpg)

---

## ✨ Tính Năng Nổi Bật

- 🤖 **Đấu với Máy AI Thông Minh**:
  - **Tập sự (Dễ)**: Thích hợp cho người mới bắt đầu làm quen với cờ caro.
  - **Trung bình (Vừa)**: Nhận biết các thế cờ cơ bản.
  - **Cao thủ (Khó)**: Tấn công sắc bén, phòng thủ chủ động.
  - **Bậc thầy (Gomoku Pro)**: Phân tích sâu thế 4 hở 2 đầu, đòn kép đôi 3, hóa giải bẫy đối thủ với phản xạ tức thì (<150ms).
- 👥 **Chế độ 2 Người (Pass & Play)**: Chơi đối kháng luân phiên trên cùng một màn hình điện thoại hoặc máy tính.
- ⚖️ **Tùy Chọn Luật Chơi Chuẩn Xác**:
  - **Luật Chuẩn Việt Nam**: Xếp đủ 5 quân liên tiếp và **không bị chặn cả 2 đầu** bởi quân đối phương mới thắng.
  - **Luật Tự Do (Quốc tế)**: Đủ 5 quân liên tiếp bất kỳ (kể cả bị chặn 2 đầu) là chiến thắng.
- 🎨 **Bàn Cờ Chân Thực & Tùy Biến Giao Diện**:
  - Kích thước bàn cờ **15×15** (tiêu chuẩn thi đấu) hoặc **19×19** (bàn cờ lớn).
  - Điểm sao (Tengen & Hoshi) chuẩn mực.
  - 3 chủ đề mặt bàn: *Gỗ Tự Nhiên*, *Giấy Mộc*, *Đêm Huyền Bí*.
  - Công cụ thu phóng (Zoom In/Out/Reset 100%) thuận tiện thao tác trên điện thoại màn hình nhỏ.
- 🔊 **Âm Thanh Sống Động**:
  - Hiệu ứng tiếng gõ quân cờ gỗ giòn giã và nhạc mừng chiến thắng được tổng hợp trực tiếp bằng **Web Audio API** (không cần file mp3 nặng, chạy mượt mà không độ trễ).
  - Tùy chọn bật/tắt âm thanh tiện lợi.
- 🛠️ **Công Cụ Hỗ Trợ Đỉnh Cao**:
  - **Gợi ý nước đi (Hint)**: Đề xuất vị trí tối ưu kèm lý do chiến thuật rõ ràng.
  - **Đi lại (Undo) & Đánh tiếp (Redo)**.
  - **Hiện số thứ tự nước đi** trên từng quân cờ.
  - **Đồng hồ đếm ngược mỗi lượt**: Tự do, 15s (cờ chớp), 30s hoặc 60s.
  - **Biên bản ghi chép nước đi**: Tọa độ chuẩn bàn cờ (A1 - O15).
  - **Thống kê trận đấu**: Lưu trữ tỉ số thắng/thua và chuỗi trận thắng liên tiếp.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### Yêu cầu hệ thống:
- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
- Trình quản lý gói `npm`, `pnpm` hoặc `yarn`

### Các bước cài đặt:

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/<tai-khoan-cua-ban>/caro-game.git
   cd caro-game
   ```

2. **Cài đặt các thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt và truy cập: `http://localhost:3000`

4. **Đóng gói dự án để triển khai (Production Build):**
   ```bash
   npm run build
   ```

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Synthesized Native Web Audio API

---

## 📜 Giấy Phép

Mã nguồn được phân phối dưới giấy phép [Apache-2.0](LICENSE).
