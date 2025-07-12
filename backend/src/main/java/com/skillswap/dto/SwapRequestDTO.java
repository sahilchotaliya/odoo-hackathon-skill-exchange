package com.skillswap.dto;

import com.skillswap.model.SwapRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwapRequestDTO {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private Long receiverId;
    private String receiverName;
    private String skillOffered;
    private String skillWanted;
    private String message;
    private SwapRequest.SwapStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}