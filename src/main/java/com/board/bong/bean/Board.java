package com.board.bong.bean;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Board{
    //    id(번호), 제목, 작성자, 조회수, 날짜, 추천, 비추천, 첨부파일, 댓글 수
//    CREATE TABLE product (
//   `id` BINARY(16) NOT NULL primary key
//   ,`name` varchar(64)
//) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    @Id
//    @GeneratedValue(generator = "uuid2")
//    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    private String title;
    @Column(name = "content", columnDefinition = "text")
    private String content;
    private String author;
    private int view;
    private LocalDateTime time;
    private int recommendation;
    private int decommendation;
    private int comment;
    private String category;

    public Board() {
    }

    public Board(UUID uuid, String title, String content, String author, int view, LocalDateTime time, int recommendation,
                 int decommendation, int comment, String category) {
        this.id = uuid;
        this.title = title;
        this.content = content;
        this.author = author;
        this.view = view;
        this.time = time;
        this.recommendation = recommendation;
        this.decommendation = decommendation;
        this.comment = comment;
        this.category = category;
    }
    public Board(UUID uuid, String title, String content, String author, LocalDateTime time, int comment, String category) {
        this.id = uuid;
        this.title = title;
        this.content = content;
        this.author = author;
        this.time = time;
        this.comment = comment;
        this.category = category;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getView() {
        return view;
    }

    public void setView(int view) {
        this.view = view;
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

    public int getComment() {
        return comment;
    }

    public void setComment(int comment) {
        this.comment = comment;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
