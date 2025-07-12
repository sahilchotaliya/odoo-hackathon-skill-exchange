package com.skillswap.service;

import com.skillswap.dto.SwapRequestDTO;
import com.skillswap.model.SwapRequest;
import com.skillswap.model.User;
import com.skillswap.repository.SwapRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SwapService {

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private UserService userService;

    public SwapRequestDTO createSwapRequest(SwapRequest swapRequest) {
        User currentUser = userService.getCurrentUserEntity();
        
        // Fix: Check if receiver is null and handle receiverId directly
        User receiver;
        if (swapRequest.getReceiver() == null && swapRequest.getReceiverId() != null) {
            receiver = userService.getUserEntityById(swapRequest.getReceiverId());
            swapRequest.setReceiver(receiver);
        } else if (swapRequest.getReceiver() != null) {
            receiver = userService.getUserEntityById(swapRequest.getReceiver().getId());
            swapRequest.setReceiver(receiver);
        } else {
            throw new RuntimeException("Receiver information is missing");
        }
        
        swapRequest.setRequester(currentUser);
        swapRequest.setStatus(SwapRequest.SwapStatus.PENDING);
        swapRequest.setCreatedAt(LocalDateTime.now());
        
        SwapRequest savedRequest = swapRequestRepository.save(swapRequest);
        return convertToDTO(savedRequest);
    }

    public List<SwapRequestDTO> getSentRequests() {
        User currentUser = userService.getCurrentUserEntity();
        return swapRequestRepository.findByRequester(currentUser).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SwapRequestDTO> getReceivedRequests() {
        User currentUser = userService.getCurrentUserEntity();
        return swapRequestRepository.findByReceiver(currentUser).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SwapRequestDTO updateSwapRequestStatus(Long id, SwapRequest.SwapStatus status) {
        SwapRequest swapRequest = swapRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap request not found with id: " + id));
        
        User currentUser = userService.getCurrentUserEntity();
        
        // Validate that the current user is authorized to update this request
        if (status == SwapRequest.SwapStatus.CANCELLED) {
            if (!swapRequest.getRequester().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Only the requester can cancel a swap request");
            }
        } else {
            if (!swapRequest.getReceiver().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Only the receiver can accept or reject a swap request");
            }
        }
        
        swapRequest.setStatus(status);
        swapRequest.setUpdatedAt(LocalDateTime.now());
        
        SwapRequest updatedRequest = swapRequestRepository.save(swapRequest);
        return convertToDTO(updatedRequest);
    }

    public List<SwapRequestDTO> getAllSwapRequests() {
        return swapRequestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SwapRequestDTO> getSwapRequestsByStatus(SwapRequest.SwapStatus status) {
        return swapRequestRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
        dto.setUpdatedAt(swapRequest.getUpdatedAt());
        return dto;
    }
}