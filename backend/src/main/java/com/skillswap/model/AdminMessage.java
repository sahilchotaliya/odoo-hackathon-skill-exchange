package com.skillswap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String content;
    private boolean isGlobal = true;
    
    @ManyToOne
    @JoinColumn(name = "target_user_id")
    private User targetUser;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}