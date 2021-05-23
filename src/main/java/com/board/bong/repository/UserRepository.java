package com.board.bong.repository;

import com.board.bong.bean.User;
import org.springframework.data.jpa.repository.JpaRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface UserRepository extends JpaRepository<User, Long> {
    User findById(String username);
}