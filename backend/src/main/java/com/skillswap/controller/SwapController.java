package com.skillswap.controller;

import java.util.ArrayList;

import com.skillswap.dto.SwapRequestDTO;
import com.skillswap.model.SwapRequest;
import com.skillswap.service.SwapService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swaps")
public class SwapController {

    @Autowired
    private SwapService swapService;

    @PostMapping
    public ResponseEntity<SwapRequestDTO> createSwapRequest(@RequestBody SwapRequest swapRequest) {
        return ResponseEntity.ok(swapService.createSwapRequest(swapRequest));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<SwapRequestDTO>> getSentRequests() {
        return ResponseEntity.ok(swapService.getSentRequests());
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<SwapRequestDTO>> getMyRequests() {
        List<SwapRequestDTO> sentRequests = swapService.getSentRequests();
        List<SwapRequestDTO> receivedRequests = swapService.getReceivedRequests();

        // Combine both lists
        List<SwapRequestDTO> allRequests = new ArrayList<>();
        allRequests.addAll(sentRequests);
        allRequests.addAll(receivedRequests);

        return ResponseEntity.ok(allRequests);
    }

    @GetMapping("/received")
    public ResponseEntity<List<SwapRequestDTO>> getReceivedRequests() {
        return ResponseEntity.ok(swapService.getReceivedRequests());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<SwapRequestDTO> acceptSwapRequest(@PathVariable Long id) {
        return ResponseEntity.ok(swapService.updateSwapRequestStatus(id, SwapRequest.SwapStatus.ACCEPTED));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<SwapRequestDTO> rejectSwapRequest(@PathVariable Long id) {
        return ResponseEntity.ok(swapService.updateSwapRequestStatus(id, SwapRequest.SwapStatus.REJECTED));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SwapRequestDTO> cancelSwapRequest(@PathVariable Long id) {
        return ResponseEntity.ok(swapService.updateSwapRequestStatus(id, SwapRequest.SwapStatus.CANCELLED));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SwapRequestDTO>> getAllSwapRequests() {
        return ResponseEntity.ok(swapService.getAllSwapRequests());
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SwapRequestDTO>> getSwapRequestsByStatus(@PathVariable SwapRequest.SwapStatus status) {
        return ResponseEntity.ok(swapService.getSwapRequestsByStatus(status));
    }
}
