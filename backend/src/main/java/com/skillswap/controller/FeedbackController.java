package com.skillswap.controller;

import com.skillswap.dto.FeedbackDTO;
import com.skillswap.model.Feedback;
import com.skillswap.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackDTO> createFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.createFeedback(feedback));
    }

    @GetMapping("/received")
    public ResponseEntity<List<FeedbackDTO>> getReceivedFeedback() {
        return ResponseEntity.ok(feedbackService.getReceivedFeedback());
    }

    @GetMapping("/given")
    public ResponseEntity<List<FeedbackDTO>> getGivenFeedback() {
        return ResponseEntity.ok(feedbackService.getGivenFeedback());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackDTO>> getUserFeedback(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getUserFeedback(userId));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}