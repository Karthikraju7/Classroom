package com.classroom.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ClassroomApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClassroomApplication.class, args);
		System.out.println("🚀 Classroom Server Started Successfully");
	}

	@GetMapping("/health")
	public String health() {
		return "OK";
	}
}
