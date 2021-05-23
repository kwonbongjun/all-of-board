package com.board.bong;

import com.board.bong.bean.Account;
import com.board.bong.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class SpringBoardApplication implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(SpringBoardApplication.class, args);
    }
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private AccountRepository repository;

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            Account account = new Account("Alice1","Smith1");
            System.out.println("---------" + account.getUsername());
//            account.setEmail("");
//            account.setUsername("");
//            mongoTemplate.insert(account);
        };
    }

    @Override
    public void run(String... args) throws Exception {
        repository.deleteAll();
//        repository.save(new Account("Alice", "Smith"));
//        repository.save(new Customer("Bob", "Smith"));

        // fetch all customers
        System.out.println("Customers found with findAll():");
        System.out.println("-------------------------------");
        for (Account account : repository.findAll()) {
            System.out.println(account);
        }
        System.out.println();

        // fetch an individual customer
        System.out.println("Customer found with findByFirstName('Alice'):");
        System.out.println("--------------------------------");
        System.out.println(repository.findByUsername("Alice"));

        System.out.println("Customers found with findByLastName('Smith'):");
        System.out.println("--------------------------------");
        for (Account account : repository.findByEmail("Smith")) {
            System.out.println(account);
        }

    }

}
