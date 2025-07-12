package com.skillswap.controller;

import com.skillswap.dto.FeedbackDTO;
import com.skillswap.dto.SwapRequestDTO;
import com.skillswap.dto.UserDTO;
import com.skillswap.model.AdminMessage;
import com.skillswap.model.SwapRequest;
import com.skillswap.service.AdminMessageService;
import com.skillswap.service.FeedbackService;
import com.skillswap.service.SwapRequestService;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private SwapRequestService swapRequestService;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private AdminMessageService adminMessageService;

    // User Management Endpoints
    // ... existing code ...

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllPublicUsers());
    }

// ... existing code ...

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        userService.banUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id) {
        userService.unbanUser(id);
        return ResponseEntity.ok().build();
    }

    // Swap Request Management Endpoints
    @GetMapping("/swap-requests")
    public ResponseEntity<List<SwapRequestDTO>> getAllSwapRequests() {
        return ResponseEntity.ok(swapRequestService.getAllSwapRequests());
    }

    @PutMapping("/swap-requests/{id}/status")
    public ResponseEntity<SwapRequestDTO> updateSwapRequestStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(convertToDTO(swapRequestService.updateSwapRequestStatus(id, SwapRequest.SwapStatus.valueOf(status.toUpperCase()))));
    }

    private SwapRequestDTO convertToDTO(SwapRequest swapRequest) {
        SwapRequestDTO dto = new SwapRequestDTO();
        dto.setId(swapRequest.getId());
        dto.setRequesterId(swapRequest.getRequester().getId());
        dto.setRequesterName(swapRequest.getRequester().getName());
        dto.setReceiverId(swapRequest.getReceiver().getId());
        dto.setReceiverName(swapRequest.getReceiver().getName());
        dto.setSkillOffered(swapRequest.getSkillOffered());
        dto.setSkillWanted(swapRequest.getSkillWanted());
        dto.setMessage(swapRequest.getMessage());
        dto.setStatus(swapRequest.getStatus());
        dto.setCreatedAt(swapRequest.getCreatedAt());
        if (swapRequest.getUpdatedAt() != null) {
            dto.setUpdatedAt(swapRequest.getUpdatedAt());
        }
        return dto;
    }

    // Feedback Management Endpoints
    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @GetMapping("/users/{userId}/feedback")
    public ResponseEntity<List<FeedbackDTO>> getUserFeedback(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getUserFeedback(userId));
    }

    // Admin Messaging Endpoints
    @PostMapping("/messages/global")
    public ResponseEntity<AdminMessage> sendGlobalMessage(
            @RequestParam String title,
            @RequestParam String content) {
        return ResponseEntity.ok(adminMessageService.createGlobalMessage(title, content));
    }

    @PostMapping("/messages/user/{userId}")
    public ResponseEntity<AdminMessage> sendUserMessage(
            @PathVariable Long userId,
            @RequestParam String title,
            @RequestParam String content) {
        return ResponseEntity.ok(adminMessageService.createUserMessage(userId, title, content));
    }

    @GetMapping("/messages/global")
    public ResponseEntity<List<AdminMessage>> getGlobalMessages() {
        return ResponseEntity.ok(adminMessageService.getGlobalMessages());
    }

    @GetMapping("/messages/user/{userId}")
    public ResponseEntity<List<AdminMessage>> getUserMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(adminMessageService.getUserMessages(userId));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<AdminMessage>> getAllMessages() {
        return ResponseEntity.ok(adminMessageService.getAllMessages());
    }

    // System Statistics Endpoint


    // Inner class for system statistics
    private static class SystemStatistics {
        private long totalUsers;
        private long activeSwapRequests;
        private long totalFeedback;
        private LocalDateTime systemTime;

        // Getters and Setters
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getActiveSwapRequests() { return activeSwapRequests; }
        public void setActiveSwapRequests(long activeSwapRequests) { this.activeSwapRequests = activeSwapRequests; }
        public long getTotalFeedback() { return totalFeedback; }
        public void setTotalFeedback(long totalFeedback) { this.totalFeedback = totalFeedback; }
        public LocalDateTime getSystemTime() { return systemTime; }
        public void setSystemTime(LocalDateTime systemTime) { this.systemTime = systemTime; }
    }
}