package com.example.Todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // Đảm bảo ở trên ghi là <Todo, Long> chứ không phải <Object, Long> nhé
}