## 🚀 Features

### 🔐 Per-Course Role Isolation
- A single user can act as:
  - 👨‍🏫 Teacher in one course
  - 🎓 Student in another
- All permissions enforced at backend level
- Prevents cross-course and cross-role access

---

### 📢 Announcement-Centric Design
- Announcements act as the **core entity**
- Assignments and attachments are derived as **filtered views**
- Scalable architecture for future features

---

### 📝 Assignment Workflow
- Assignment creation with due dates
- One-to-one student submissions
- Teacher grading & feedback
- Deadline enforcement from backend

---

### 💬 Private Messaging System
- Role-based messaging system
- Teacher ↔ Students communication
- Secure and restricted access

---

### 🎥 Live Classroom (WebRTC) 
- Real-time video sessions using **WebRTC**
- WebSocket signaling via **STOMP + SockJS**
- Teacher-controlled live sessions
- Students join via room-based sessions

#### 🔁 Flow:
1. Student joins session
2. Teacher sends WebRTC offer
3. Student responds with answer
4. ICE candidates exchanged
5. Peer-to-peer video connection established

#### ⚙️ Features:
- Live video/audio streaming
- Participant tracking
- Teacher-only **End Session**
- Safe handling of:
  - connection lifecycle
  - signaling states
  - camera/mic permissions

---

### 🔑 Secure Authentication
- JWT-based authentication
- Spring Security protected APIs

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Spring Boot  
- **Database:** MySQL  
- **Realtime:** WebRTC, WebSocket (STOMP + SockJS)  
- **Authentication:** JWT  
- **Tools:** Postman  

---

## 🧠 System Design Highlights

- Clean separation of concerns
- Backend-driven authorization
- Real-time communication using WebRTC
- Scalable entity relationships
- Production-ready architecture patterns

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Karthikraju7/Classroom.git
   cd Classroom

2. **Backend Setup**

- Install Java 17+ and Maven
- Update `application.yml` with your DB credentials
- Run:

  ```bash
  mvn spring-boot:run

3. **Frontend Setup**

- Install Node.js and npm
- Navigate to client folder:

  ```bash
  cd client
  npm install
  npm run dev
