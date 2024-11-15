-- Drop and create the database
DROP DATABASE IF EXISTS urbantech_2024;
CREATE DATABASE urbantech_2024;
USE urbantech_2024;

-- Drop and create the 'users' table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    username VARCHAR(200) UNIQUE,
    password VARCHAR(200),
    phone VARCHAR(200),
    role ENUM('admin', 'user', 'manager', 'employee') DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    updated_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_dt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data into 'users' table
INSERT INTO users (name, username, password, role)
VALUES
    ('admin', 'admin', MD5('admin:L4igwSjdGa'), 'admin'),
    ('manager#1', 'manager#1', MD5('manager:L4igwSjdGa'), 'manager'),
    ('manager#2', 'manager#2', MD5('manager:L4igwSjdGa'), 'manager');

-- Drop and create the 'branches' table
DROP TABLE IF EXISTS branches;
CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    branch_name VARCHAR(200),
    branch_description VARCHAR(200),
    active BOOLEAN DEFAULT TRUE,
    updated_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_branch FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Drop and create the 'employees' table
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    user_id INT,
    active BOOLEAN DEFAULT TRUE,
    updated_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_branch_employee FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_employee FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
