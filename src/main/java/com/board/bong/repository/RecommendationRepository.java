package com.board.bong.repository;

import com.board.bong.bean.BoardCntGroupByCategory;
import com.board.bong.bean.Comment;
import com.board.bong.bean.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
    @Query(value = "SELECT * FROM recommendation where board_id = ?1 AND user_id = ?2 AND type = ?3", nativeQuery = true)
    Recommendation findByBoardIdAndUserIdAndType(
            UUID boardId,
            String userId,
            String type);
    @Transactional
    void deleteByid(UUID id);
}
