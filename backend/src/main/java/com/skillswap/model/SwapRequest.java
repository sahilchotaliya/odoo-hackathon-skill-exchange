package com.skillswap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "swap_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwapRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;
    
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;
    
    private String skillOffered;
    private String skillWanted;
    private String message;
    
    @Enumerated(EnumType.STRING)
    private SwapStatus status = SwapStatus.PENDING;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "swapRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private Feedback feedback;
    
    public enum SwapStatus {
        PENDING, ACCEPTED, REJECTED, CANCELLED
    }
    
    // Add this field
    @Transient // This field won't be persisted to the database
    private Long receiverId;
    
    // Add getter and setter
    public Long getReceiverId() {
        return receiverId;
    }
    
    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
}