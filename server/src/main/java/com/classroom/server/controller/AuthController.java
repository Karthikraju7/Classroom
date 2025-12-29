package com.classroom.server.controller;

import com.classroom.server.dto.auth.AuthResponse;
import com.classroom.server.dto.auth.LoginRequest;
import com.classroom.server.dto.auth.RegisterRequest;
import com.classroom.server.entity.User;
import com.classroom.server.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);

            return ResponseEntity.ok(
                    new AuthResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail()
                    )
            );
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);

            return ResponseEntity.ok(
                    new AuthResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail()
                    )
            );
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }
}
