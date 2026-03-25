# 📋 Kanban Board Application

แอปพลิเคชันจัดการงานแบบ Kanban Board ที่พัฒนาด้วย **React** และ **Vite** ออกแบบมาเพื่อให้การทำงานร่วมกันในทีมเป็นเรื่องง่ายและมีประสิทธิภาพ พร้อมระบบลาก-วาง (Drag and Drop) ที่ลื่นไหลและการแจ้งเตือนภายในระบบ

---

## ✨ คุณสมบัติหลัก (Key Features)

### 🔐 การจัดการผู้ใช้ (User Management)
*   **สมัครสมาชิกและเข้าสู่ระบบ:** ระบบรองรับการ Register และ Login เพื่อแยกพื้นที่การทำงานของแต่ละคน
*   **ความปลอดภัยพื้นฐาน:** มีระบบตรวจสอบชื่อผู้ใช้งานซ้ำและรหัสผ่านที่ถูกต้อง
*   **โปรไฟล์:** แสดงตัวอักษรแรกของชื่อผู้ใช้ (Initials) เป็น Avatar เพื่อความพรีเมียม

### 📊 การจัดการบอร์ด (Board Management)
*   **สร้างบอร์ดไม่จำกัด:** สร้างพื้นที่การทำงานแยกตามโปรเจกต์ได้ตามต้องการ
*   **จัดการบอร์ด:** สามารถเปลี่ยนชื่อบอร์ด (Inline Edit) หรือลบโหมดบอร์ดที่ไม่ใช้งานแล้วได้
*   **เชิญสมาชิก (Collaboration):** เชิญเพื่อนร่วมทีมเข้ามาทำงานในบอร์ดเดียวกันได้ด้วยระบบ Share พร้อมแจ้งเตือนผู้ที่ถูกเชิญ
*   **สิทธิ์การเข้าถึง:** ผู้ใช้จะเห็นเฉพาะบอร์ดที่ตัวเองเป็นคนสร้างหรือเป็นสมาชิกเท่านั้น

### 🪜 การจัดการคอลัมน์และงาน (Columns & Tasks)
*   **คอลัมน์:** เพิ่ม, ลบ และแก้ไขชื่อคอลัมน์ได้อิสระ เพื่อปรับ Workflow (เช่น To Do, Doing, Done)
*   **การจัดการงาน:** สร้างงานใหม่ได้รวดเร็ว, แก้ไขรายละเอียด, และลบงานที่ทำเสร็จแล้ว
*   **Drag & Drop:** ลากและวางงานเพื่อเปลี่ยนสถานะด้วยวิธีธรรมชาติ (Native HTML5 API)
*   **Tags:** เพิ่มป้ายกำกับ (Tags) ให้กับงานเพื่อจำแนกประเภทหรือระดับความสำคัญ
*   **ผู้รับผิดชอบ (Assignees):** มอบหมายงานให้สมาชิกในทีมได้หลายคน พร้อมระบบแจ้งเตือนไปยังผู้ถูกมอบหมายโดยอัตโนมัติ

### 🔔 ระบบเสริม (Advanced Features)
*   **Notifications:** ระบบแจ้งเตือนภายในแอป (In-app notifications) เมื่อมีการเชิญเข้าบอร์ดหรือมอบหมายงานใหม่
*   **Persistence:** ข้อมูลทั้งหมดถูกจัดเก็บไว้ใน `localStorage` ข้อมูลจะไม่หายไปเมื่อ Refresh หน้าเว็บ
*   **Custom Dialogs:** ระบบ Modal แจ้งเตือน (Alert), ยืนยัน (Confirm), และรับค่า (Prompt) ที่ออกแบบใหม่ให้สวยงามและรองรับ Asynchronous logic

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Phosphor Icons](https://phosphoricons.com/)
*   **State Management:** React Context API (`KanbanContext`)
*   **Drag & Drop:** Native HTML5 Drag and Drop API

---

## 🚀 การติดตั้งและใช้งาน (Getting Started)

1.  **Clone โปรเจกต์:**
    ```bash
    git clone [your-repository-url]
    cd kanban-board
    ```

2.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```

3.  **รันในโหมด Development:**
    ```bash
    npm run dev
    ```

4.  **วิธีทดสอบ (Mock Users):**
    คุณสามารถใช้ User เริ่มต้นต่อไปนี้เพื่อทดสอบระบบ:
    *   **Username:** `admin`, `user1`, `user2`
    *   **Password:** `password` (เหมือนกันทั้งหมด)

---

## 📁 โครงสร้างโฟลเดอร์ (Project Structure)

*   `src/context/`: จัดการสถานะหลักและ Logic ทั้งหมดของแอป (`KanbanContext.jsx`)
*   `src/components/`: คอมโพเนนต์ UI ทั้งหมด เช่น `Sidebar`, `Header`, `BoardColumn`, `TaskCard`, `TaskModal`, `ConfirmModal`
*   `src/App.jsx`: จุดเริ่มต้นของแอปพลิเคชันและการจัดการ Drag & Drop
*   `index.css`: ไฟล์สไตล์กลางและ Tailwind configuration

---

จัดทำโดย [Tanongsak-BKK](https://github.com/Tanongsak-BKK)
