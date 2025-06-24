package com.larplaner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LarplanerApplication {

  public static void main(String[] args) {
    SpringApplication.run(LarplanerApplication.class, args);
  }

}
