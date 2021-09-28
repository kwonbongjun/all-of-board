package com.board.bong.bean;

import java.io.Serializable;

public class BoardCntGroupByCategory implements Serializable {
    String category;
    long cnt;

    public BoardCntGroupByCategory(String category, long cnt) {
        this.category = category;
        this.cnt = cnt;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getCnt() {
        return cnt;
    }

    public void setCnt(long cnt) {
        this.cnt = cnt;
    }
}