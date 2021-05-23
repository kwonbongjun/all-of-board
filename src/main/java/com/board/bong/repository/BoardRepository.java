package com.board.bong.repository;

import com.board.bong.bean.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {
    Board findByid(UUID uuid);
//    @PersistenceContext
//    EntityManager entityManager;
//
//    @Transactional
//    public void insertWithEntityManager(Board board) {
//        this.entityManager.persist(board);
//    }
}
