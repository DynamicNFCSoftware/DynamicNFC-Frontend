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
        
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()); 
        Authentication authentication = authenticationManager.authenticate(token); 
        SecurityContextHolder.getContext().setAuthentication(authentication); 
        
        // This forces session creation if it does not exist 
        HttpSession session = httpRequest.getSession(true);

        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            SecurityContextHolder.getContext()
        );
        
        // Get account to include accountId in response
        Account account = accountService.findByEmail(request.getEmail());
        
        AuthResponse response = new AuthResponse();
        response.setEmail(request.getEmail());
        response.setAccountId(account.getId());
        response.setSessionId(session.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        Account account = new Account();
        account.setEmail(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        
        accountService.save(account);
        
        return ResponseEntity.ok(new AuthResponse());
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