package com.board.bong.bean;

import org.springframework.data.domain.Persistable;

import javax.persistence.*;

@Entity // This tells Hibernate to make a table out of this class
public class User implements Persistable<String> {
    @Id
//    @GeneratedValue(strategy=GenerationType.AUTO)
    private String id;

    private String password;

    private String role;

    @Transient
    private boolean update;

    @Override
    public boolean isNew() {
        return !update;
    }
    @PrePersist
    @PostLoad
    void markUpdated() {
        this.update = true;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}