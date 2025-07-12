package com.skillswap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;
    private String location;
    private String profilePhoto;
    private String availability;
    private boolean isPublic = true;
    private boolean isAdmin = false;
    private boolean isBanned = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_offered", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private Set<String> skillsOffered = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_wanted", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private Set<String> skillsWanted = new HashSet<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SwapRequest> sentRequests = new HashSet<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SwapRequest> receivedRequests = new HashSet<>();
}
