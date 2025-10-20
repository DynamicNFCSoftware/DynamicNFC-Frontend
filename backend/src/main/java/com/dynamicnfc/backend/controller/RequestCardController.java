package com.dynamicnfc.backend.controller;

import com.dynamicnfc.backend.dto.RequestCardRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = {
    "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
    "https://localhost:3000", "https://localhost:3001", "https://localhost:3002",
    "http://3.128.244.219:3000", "http://3.128.244.219:3001", "http://3.128.244.219:3002", 
    "https://3.128.244.219:3000", "https://3.128.244.219:3001", "https://3.128.244.219:3002",
    "http://dynamicnfc.ca", "https://dynamicnfc.ca", 
    "http://www.dynamicnfc.ca", "https://www.dynamicnfc.ca"
})
@RestController
@RequestMapping("/api")
public class RequestCardController {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private static final String TARGET_EMAIL = "dynamicnfc3@gmail.com";

    @PostMapping("/request-card")
    public ResponseEntity<?> requestCard(@RequestBody RequestCardRequest req) {
        // basic validation
        if (req == null || (isBlank(req.getEmail()) && isBlank(req.getFullName()))) {
            return ResponseEntity.badRequest().body("fullName or email required");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("New card request:\n\n");
        sb.append("Full name: ").append(nullToEmpty(req.getFullName())).append("\n");
        sb.append("Email: ").append(nullToEmpty(req.getEmail())).append("\n");
        sb.append("Phone: ").append(nullToEmpty(req.getPhone())).append("\n");
        sb.append("Company: ").append(nullToEmpty(req.getCompany())).append("\n");
        sb.append("Job title: ").append(nullToEmpty(req.getJobTitle())).append("\n");
        sb.append("Address: ").append(nullToEmpty(req.getAddress())).append("\n");
        sb.append("Plan: ").append(nullToEmpty(req.getPlan())).append("\n\n");
        sb.append("Notes:\n").append(nullToEmpty(req.getNotes())).append("\n");

        String body = sb.toString();

        // Try to send email if mailSender is available
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(TARGET_EMAIL);
                message.setSubject("NFC Card Request from " + (isBlank(req.getFullName()) ? req.getEmail() : req.getFullName()));
                message.setText(body);
                mailSender.send(message);
                System.out.println("Email sent successfully");
                return ResponseEntity.ok("sent via email");
            } catch (MailException ex) {
                System.err.println("Mail send failed, falling back to console log: " + ex.getMessage());
                ex.printStackTrace();
            }
        }

        // Fallback: log to console
        System.out.println("=== Card Request ===");
        System.out.println(body);
        System.out.println("==================");
        return ResponseEntity.ok("logged");
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String nullToEmpty(String s) { return s == null ? "" : s; }
}
