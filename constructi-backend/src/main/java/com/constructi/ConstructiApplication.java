package com.constructi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.constructi")
public class ConstructiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConstructiApplication.class, args);
    }

}
