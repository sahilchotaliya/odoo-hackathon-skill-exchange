package com.skillswap.service;

import com.skillswap.dto.UserDTO;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        User user = getUserByEmail(currentUserEmail);
        return convertToDTO(user);
    }

    public User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        return getUserByEmail(currentUserEmail);
    }

    public UserDTO updateCurrentUser(User updatedUser) {
        User currentUser = getCurrentUserEntity();
        
        if (updatedUser.getName() != null) {
            currentUser.setName(updatedUser.getName());
        }
        if (updatedUser.getLocation() != null) {
            currentUser.setLocation(updatedUser.getLocation());
        }
        if (updatedUser.getProfilePhoto() != null) {
            currentUser.setProfilePhoto(updatedUser.getProfilePhoto());
        }
        if (updatedUser.getAvailability() != null) {
            currentUser.setAvailability(updatedUser.getAvailability());
        }
        if (updatedUser.getSkillsOffered() != null && !updatedUser.getSkillsOffered().isEmpty()) {
            currentUser.setSkillsOffered(updatedUser.getSkillsOffered());
        }
        if (updatedUser.getSkillsWanted() != null && !updatedUser.getSkillsWanted().isEmpty()) {
            currentUser.setSkillsWanted(updatedUser.getSkillsWanted());
        }
        currentUser.setPublic(updatedUser.isPublic());
        
        User savedUser = userRepository.save(currentUser);
        return convertToDTO(savedUser);
    }

    // Add this method to get User entity by ID
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public List<UserDTO> getAllPublicUsers() {
        return userRepository.findByIsPublicTrueAndIsBannedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> findUsersBySkillOffered(String skill) {
        return userRepository.findBySkillOffered(skill).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> findUsersBySkillWanted(String skill) {
        return userRepository.findBySkillWanted(skill).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO banUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setBanned(true);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO unbanUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setBanned(false);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setLocation(user.getLocation());
        dto.setProfilePhoto(user.getProfilePhoto());
        dto.setAvailability(user.getAvailability());
        dto.setPublic(user.isPublic());
        dto.setSkillsOffered(user.getSkillsOffered());
        dto.setSkillsWanted(user.getSkillsWanted());
        return dto;
    }
    
    // Add this method to find user by email (returning Optional<User>)
    public java.util.Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Add this method to update a user
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    // Add this method to find all public users (alias for getAllPublicUsers)
    public List<UserDTO> findAllPublicUsers() {
        return getAllPublicUsers();
    }
    
    /**
     * Updates a user's skills (both offered and wanted)
     * @param email The email of the user to update
     * @param skills Map containing skillsOffered and/or skillsWanted sets
     * @return Updated User object
     */
    public User updateUserSkills(String email, Map<String, Set<String>> skills) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        if (skills.containsKey("skillsOffered")) {
            user.setSkillsOffered(skills.get("skillsOffered"));
        }
        
        if (skills.containsKey("skillsWanted")) {
            user.setSkillsWanted(skills.get("skillsWanted"));
        }
        
        return userRepository.save(user);
    }
}