-- 1. Tạo cơ sở dữ liệu (Nếu chưa có)
CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

-- 2. Tạo bảng quản lý công việc (Todo)
CREATE TABLE IF NOT EXISTS todo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- 3. Thêm một số dữ liệu mẫu để kiểm tra API
INSERT INTO todo (title, completed) VALUES ('Học lập trình Spring Boot', false);
INSERT INTO todo (title, completed) VALUES ('Làm bài tập lớn Java', true);
INSERT INTO todo (title, completed) VALUES ('Cấu hình xong Database', false);