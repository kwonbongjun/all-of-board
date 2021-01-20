package com.rating.bong;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AccountRepository extends MongoRepository<Account, String> {
    public Account findByUsername(String username);
    public List<Account> findByEmail(String email);
}
