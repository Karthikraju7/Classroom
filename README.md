# 📚 Classroom Management Platform

A **full-stack classroom management system** designed with **per-course role isolation**, scalable domain modeling, and strict backend-enforced access control.  
Built using **Spring Boot, MySQL, React, Tailwind CSS, and JWT authentication**.

**Main Aim:**  
To simulate real classroom workflows where a single user can act as a **Teacher in one course and a Student in another**.

---

## 🚀 Features

### 🔐 Per-Course Role Isolation
- A single user can have different roles across different courses
- All permissions are enforced at the backend level
- Prevents cross-course and cross-role data access

### 📢 Announcement-Centric Design
- Announcements are designed as the **core entity**
- Assignments and attachments are derived as **filtered views**
- Keeps the system flexible and scalable as features grow

### 📝 Assignment Workflow
- Assignment creation with due dates
- One-to-one student submissions
- Teacher feedback on submissions
- Backend-enforced submission and deadline rules

### 💬 Private Messaging System
- Strict role-based private messaging
- Teachers can message multiple students
- Students can privately contact instructors
- No unauthorized access between roles

### 🔑 Secure Authentication
- JWT-based authentication
- APIs protected using Spring Security

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Spring Boot  
- **Database:** MySQL  
- **Authentication:** JWT  
- **Tools:** Postman  

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
  
## 📷 Screenshots

Check out all the screenshots in the [Classroom_ScreenShots folder](Classroom_ScreenShots/) here.
