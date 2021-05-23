package com.board.bong.bean;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.UUID;



@Entity
@IdClass(BoardFileKey.class)
public class BoardFile implements Persistable {
//    @EmbeddedId
//    private BoardFileKey bpk;
    @Id
//    @GeneratedValue(generator = "uuid2")
//    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @Id
    private String category;
    private String type;
    private int size;
    @Id
    private String name;

    private Blob file; //blob 테이블 따로 여러개니까.

    private @Transient boolean isNew = true;

    @Override
    public Object getId() {
        return null;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostPersist
    @PostLoad
    void markNotNew() {
        this.isNew = false;
    }

    public BoardFile() {

    }
    public BoardFile(UUID uuid, String category, String type, int size, String name,  Blob file) {
        this.id = uuid;
        this.category = category;
        this.type = type;
        this.size = size;
        this.name = name;
        this.file = file;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Blob getFile() {
        return file;
    }

    public void setFile(Blob file) {
        this.file = file;
    }

    public void setNew(boolean aNew) {
        isNew = aNew;
    }
}
