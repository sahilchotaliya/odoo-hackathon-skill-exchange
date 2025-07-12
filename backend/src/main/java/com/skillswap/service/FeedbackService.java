package com.skillswap.service;

import com.skillswap.dto.FeedbackDTO;
import com.skillswap.model.Feedback;
import com.skillswap.model.SwapRequest;
import com.skillswap.model.User;
import com.skillswap.repository.FeedbackRepository;
import com.skillswap.repository.SwapRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private UserService userService;

    public FeedbackDTO createFeedback(Feedback feedback) {
        User currentUser = userService.getCurrentUserEntity();
        SwapRequest swapRequest = swapRequestRepository.findById(feedback.getSwapRequest().getId())
                .orElseThrow(() -> new RuntimeException("Swap request not found"));
        
        // Validate that the swap request is completed and the current user is part of it
        if (swapRequest.getStatus() != SwapRequest.SwapStatus.ACCEPTED) {
            throw new RuntimeException("Feedback can only be given for accepted swap requests");
        }
        
        if (!swapRequest.getRequester().getId().equals(currentUser.getId()) && 
            !swapRequest.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only provide feedback for your own swap requests");
        }
        
        // Set the from user to current user
        feedback.setFromUser(currentUser);
        
        // Set the to user based on the swap request
        if (swapRequest.getRequester().getId().equals(currentUser.getId())) {
            feedback.setToUser(swapRequest.getReceiver());
        } else {
            feedback.setToUser(swapRequest.getRequester());
        }
        
        feedback.setCreatedAt(LocalDateTime.now());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToDTO(savedFeedback);
    }

    public List<FeedbackDTO> getReceivedFeedback() {
        User currentUser = userService.getCurrentUserEntity();
        return feedbackRepository.findByToUser(currentUser).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getGivenFeedback() {
        User currentUser = userService.getCurrentUserEntity();
        return feedbackRepository.findByFromUser(currentUser).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getUserFeedback(Long userId) {
        // Fix this line - getUserById returns UserDTO, not User
        User user = userService.getUserEntityById(userId);
        return feedbackRepository.findByToUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FeedbackDTO convertToDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setFromUserId(feedback.getFromUser().getId());
        dto.setFromUserName(feedback.getFromUser().getName());
        dto.setToUserId(feedback.getToUser().getId());
        dto.setToUserName(feedback.getToUser().getName());
        dto.setSwapRequestId(feedback.getSwapRequest().getId());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
}