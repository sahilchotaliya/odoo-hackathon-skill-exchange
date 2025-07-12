package com.skillswap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "from_user_id")
    private User fromUser;
    
    @ManyToOne
    @JoinColumn(name = "to_user_id")
    private User toUser;
    
    @OneToOne
    @JoinColumn(name = "swap_request_id")
    private SwapRequest swapRequest;
    
    private int rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();
}