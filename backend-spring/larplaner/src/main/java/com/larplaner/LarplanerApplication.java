package com.larplaner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class LarplanerApplication {

	public static void main(String[] args) {
		SpringApplication.run(LarplanerApplication.class, args);
	}

}
