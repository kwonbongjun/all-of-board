package com.board.bong.repository;

import com.board.bong.bean.Board;
import com.board.bong.bean.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByboardId(@Param(value = "boardId") UUID boardId);
    void deleteByid(UUID uuid);
}
