package com.board.bong.bean;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Comment {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @Column(columnDefinition = "BINARY(16)" ,name="board_id")
    private UUID boardId;
    private String text;
    private String author;
    private LocalDateTime time;
    private int recommendation;
    private int decommendation;
    public Comment() {

    }
    public Comment(UUID boardId, String text, String author, LocalDateTime time, int recommendation, int decommendation) {
        this.boardId = boardId;
        this.text = text;
        this.author = author;
        this.time = time;
        this.recommendation = recommendation;
        this.decommendation = decommendation;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getBoardId() {
        return boardId;
    }

    public void setBoardId(UUID boardId) {
        this.boardId = boardId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public int getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(int recommendation) {
        this.recommendation = recommendation;
    }

    public int getDecommendation() {
        return decommendation;
    }

    public void setDecommendation(int decommendation) {
        this.decommendation = decommendation;
    }
}
