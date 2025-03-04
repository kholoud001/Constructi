package com.constructi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.constructi")
@EnableScheduling
public class ConstructiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConstructiApplication.class, args);
    }

}
