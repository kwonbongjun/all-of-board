package com.board.bong.bean;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class BoardFileKey implements Serializable {
    private String name;

    private String category;

    private UUID id;
    public BoardFileKey() {};
    public BoardFileKey(String name, String category, UUID id) {
        this.name = name;
        this.category = category;
        this.id = id;
    }
    //    @ManyToOne
//    @JoinColumn(name = "id")
//    private Board board;
}
