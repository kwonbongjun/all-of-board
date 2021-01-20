package com.rating.bong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class RatingApplication implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(RatingApplication.class, args);
    }
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private AccountRepository repository;

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            Account account = new Account("Alice1","Smith1");
//            account.setEmail("max9106@naver.com");
//            account.setUsername("junseo");

//            mongoTemplate.insert(account);
        };
    }

    @Override
    public void run(String... args) throws Exception {
        repository.deleteAll();

        // save a couple of customers
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
