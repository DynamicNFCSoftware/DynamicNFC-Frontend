package com.dynamicnfc.backend.controller;

import com.dynamicnfc.backend.dto.AuthResponse;
import com.dynamicnfc.backend.dto.LoginRequest;
import com.dynamicnfc.backend.dto.RegisterRequest;
import com.dynamicnfc.backend.model.Account;
import com.dynamicnfc.backend.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AccountService accountService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, AccountService accountService, PasswordEncoder passwordEncoder) { 
        this.authenticationManager = authenticationManager;
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login") 
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) { 
        
        String email = request.getEmail().trim().toLowerCase();
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(email, request.getPassword()); 
        Authentication authentication = authenticationManager.authenticate(token); 
        SecurityContextHolder.getContext().setAuthentication(authentication); 
        
        // This forces session creation if it does not exist 
        HttpSession session = httpRequest.getSession(true);

        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            SecurityContextHolder.getContext()
        );
        
        // Get account to include accountId in response
        Account account = accountService.findByEmail(email);
        
        AuthResponse response = new AuthResponse();
        response.setEmail(email);
        response.setAccountId(account.getId());
        response.setSessionId(session.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Validate email
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        // Validate password
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }

        try {
            Account account = new Account();
            account.setEmail(request.getEmail().trim().toLowerCase());
            account.setPassword(passwordEncoder.encode(request.getPassword()));
            Account saved = accountService.save(account);

            AuthResponse response = new AuthResponse();
            response.setEmail(saved.getEmail());
            response.setAccountId(saved.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with this email already exists"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        // Clear authentication from security context
        SecurityContextHolder.clearContext();
        
        // Invalidate HTTP session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        return ResponseEntity.ok("Logout successful");
    }
}