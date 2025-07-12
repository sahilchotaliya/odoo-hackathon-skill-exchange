package com.skillswap.service;

import com.skillswap.dto.SwapRequestDTO;
import com.skillswap.model.SwapRequest;
import com.skillswap.model.User;
import com.skillswap.repository.SwapRequestRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SwapRequestService {

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public SwapRequest createSwapRequest(Long requesterId, Long receiverId, String skillOffered, String skillWanted, String message) {
        User requester = userRepository.findById(requesterId).orElseThrow(() -> new RuntimeException("Requester not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        SwapRequest swapRequest = new SwapRequest();
        swapRequest.setRequester(requester);
        swapRequest.setReceiver(receiver);
        swapRequest.setSkillOffered(skillOffered);
        swapRequest.setSkillWanted(skillWanted);
        swapRequest.setMessage(message);
        swapRequest.setStatus(SwapRequest.SwapStatus.PENDING);
        swapRequest.setCreatedAt(LocalDateTime.now());

        return swapRequestRepository.save(swapRequest);
    }

    public Optional<SwapRequest> findById(Long id) {
        return swapRequestRepository.findById(id);
    }

    public List<SwapRequestDTO> getRequestsByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<SwapRequest> sentRequests = swapRequestRepository.findByRequester(user);
        List<SwapRequest> receivedRequests = swapRequestRepository.findByReceiver(user);

        List<SwapRequestDTO> allRequests = sentRequests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        allRequests.addAll(receivedRequests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));

        return allRequests;
    }

    public List<SwapRequestDTO> getPendingRequestsForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return swapRequestRepository.findByReceiverAndStatus(user, SwapRequest.SwapStatus.PENDING).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SwapRequest updateSwapRequestStatus(Long requestId, SwapRequest.SwapStatus status) {
        SwapRequest swapRequest = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Swap request not found"));

        swapRequest.setStatus(status);
        swapRequest.setUpdatedAt(LocalDateTime.now());
        return swapRequestRepository.save(swapRequest);
    }

    public List<SwapRequestDTO> getAllSwapRequests() {
        return swapRequestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SwapRequestDTO convertToDTO(SwapRequest swapRequest) {
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
        return dto;
    }
}