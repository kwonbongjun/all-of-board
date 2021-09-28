package com.board.bong.repository;

import com.board.bong.bean.Board;
import com.board.bong.bean.BoardCntGroupByCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {
    Board findByid(UUID uuid);
    @Query("SELECT " +
            "    new com.board.bong.bean.BoardCntGroupByCategory(b.category, COUNT(b) as cnt) " +
            "FROM " +
            "    Board b " +
            "GROUP BY " +
            "    b.category")
    List<BoardCntGroupByCategory> findBoardCntGroupByCategory();
    @Modifying
    @Query(value = "UPDATE board b SET b.recommendation = ?2,b.decommendation = ?3 WHERE b.id = ?1", nativeQuery = true)
    int updateRecommendation(UUID id, int recommendation, int decommendation);

    @Modifying
    @Query(value = "UPDATE board b SET b.view = b.view + 1 WHERE b.id = ?1", nativeQuery = true)
    int updateView(UUID id);
}
