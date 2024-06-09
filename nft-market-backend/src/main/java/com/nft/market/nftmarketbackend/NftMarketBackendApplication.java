package com.nft.market.nftmarketbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class NftMarketBackendApplication  implements CommandLineRunner {

    public static void main(String[] args){
        SpringApplication.run(NftMarketBackendApplication.class, args);
    }

    @Override
    public void run(String... args)  {
        System.out.println("Server started...");
    }



}

