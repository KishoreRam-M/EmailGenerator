package com.krm.Email_Generator.Controller;

import com.krm.Email_Generator.dto.EmailRequest;
import com.krm.Email_Generator.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "https://mail.google.com")  // Allow Gmail domain for this controller

@AllArgsConstructor
public class EmailGeneratorController {
    private final EmailService emailService;

    @PostMapping("/generator")
    public ResponseEntity<String> generatorEmail(@RequestBody EmailRequest emailRequest) {
        String response = emailService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
