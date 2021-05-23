package com.board.bong.repository;

import com.board.bong.bean.Board;
import com.board.bong.bean.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Blob;
import java.util.List;
import java.util.UUID;

public interface BoardFileRepository extends JpaRepository<BoardFile, UUID> {
//    void save(BoardFile boardFile);
    List<BoardFile> findByid(UUID uuid);
    void deleteByid(UUID uuid);
}
