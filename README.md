# Enterprise Management System

An Enterprise Management System built using **Express.js**, **CSS**, **HTML**, and **EJS**, with **MySQL** as the database system. This application streamlines company management processes, including attendance tracking, task assignments, customer management, and accounting.

---

## 🚀 Project Overview

This application is designed to help enterprise companies efficiently manage their operations by offering a unified platform for critical management functionalities. 

Key features include:
- **Attendance Management**: Track employee attendance effortlessly.
- **Task Management**: Assign and monitor tasks with due dates.
- **Customer Management**: Maintain customer records and interaction history.
- **Accounting Module**: Manage financial records, invoices, and transactions.

---

## 📋 Application Features

1. **User-Friendly Interface**: Simplified navigation with a responsive design.
2. **Modular Components**: Independent modules for attendance, tasks, customers, and accounting.
3. **Secure Login System**: Role-based access control for administrators and employees.
4. **Real-Time Notifications**: Telegram bot integration for task alerts and updates.
5. **Data Reports**: Generate reports for attendance, tasks, and accounting in real-time.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, EJS (for templating)
- **Backend**: Node.js with Express.js
- **Database**: MySQL

---

## 🧑‍💻 Setting Up the Repository

### Prerequisites

Ensure the following are installed on your system:
- **Node.js (v14+)**
- **MySQL** 
- **Express.js** (via npm)

### Steps to Set Up

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Repository**:
   ```bash
   cd <repository-name>

   ```

3. **Install Dependencies: Run the following commands to set up dependencies for each module:**:
   ```bash
    cd server && npm install
    cd ../workers && npm install
    cd ../web && npm install
   ```

4. **Configure Environment Variables:**:
   - Create a .env file in the root directory based on .env.example.
   - Add your API keys, database credentials, and any other necessary configurations.

5. **Initialize the Database: Run the SQL script to set up your database schema**:
   ```bash
   mysql -u root -p < db.sql
   ```

6. **Start the Application**:
   ```bash
   npm start
   ```
