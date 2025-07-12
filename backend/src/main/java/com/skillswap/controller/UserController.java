package com.skillswap.controller;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.skillswap.dto.UserDTO;
import com.skillswap.model.User;
import com.skillswap.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Add these imports at the top of the file

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;

import com.skillswap.service.FileStorageService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllPublicUsers());
    }

    // Remove the first getUserById method
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.updateCurrentUser(user));
    }

    @GetMapping("/search/skills-offered")
    public ResponseEntity<List<UserDTO>> searchBySkillOffered(@RequestParam String skill) {
        return ResponseEntity.ok(userService.findUsersBySkillOffered(skill));
    }

    @GetMapping("/search/skills-wanted")
    public ResponseEntity<List<UserDTO>> searchBySkillWanted(@RequestParam String skill) {
        return ResponseEntity.ok(userService.findUsersBySkillWanted(skill));
    }

    // Rename the second implementations
    @GetMapping("/search/offering")
    public ResponseEntity<List<UserDTO>> searchByOfferedSkill(@RequestParam String skill) {
        // Update to use the correct service method
        return ResponseEntity.ok(userService.findUsersBySkillOffered(skill));
    }

    @GetMapping("/search/wanting")
    public ResponseEntity<List<UserDTO>> searchByWantedSkill(@RequestParam String skill) {
        // Update to use the correct service method
        return ResponseEntity.ok(userService.findUsersBySkillWanted(skill));
    }

    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> banUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.banUser(id));
    }

    @PutMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> unbanUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.unbanUser(id));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(userService.convertToDTO(user));
    }
    @GetMapping("/skills")
public ResponseEntity<Map<String, Set<String>>> getUserSkills() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();
    User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    
    Map<String, Set<String>> skills = new HashMap<>();
    skills.put("skillsOffered", user.getSkillsOffered());
    skills.put("skillsWanted", user.getSkillsWanted());
    
    return ResponseEntity.ok(skills);
}

@PutMapping("/skills")
public ResponseEntity<Map<String, Set<String>>> updateUserSkills(@RequestBody Map<String, Set<String>> skills) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();
    
    // Use the new service method
    User updatedUser = userService.updateUserSkills(email, skills);
    
    Map<String, Set<String>> updatedSkills = new HashMap<>();
    updatedSkills.put("skillsOffered", updatedUser.getSkillsOffered());
    updatedSkills.put("skillsWanted", updatedUser.getSkillsWanted());
    
    return ResponseEntity.ok(updatedSkills);
}

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO userDTO = userService.getUserById(id);
            User user = userService.getUserEntityById(id); // Use the new method
            
            if (!user.isPublic()) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String email = auth.getName();
                // Fix: Use findByEmail instead of getUserByEmail
                User currentUser = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
                if (!currentUser.isAdmin() && !currentUser.getId().equals(user.getId())) {
                    return ResponseEntity.notFound().build();
                }
            }
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateUserProfile(@RequestBody User updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    
        // Update only allowed fields
        user.setName(updatedUser.getName());  // Changed from updatedUser.getUsername()
        user.setLocation(updatedUser.getLocation());
        user.setProfilePhoto(updatedUser.getProfilePhoto());
        user.setAvailability(updatedUser.getAvailability());
        user.setPublic(updatedUser.isPublic());
        user.setSkillsOffered(updatedUser.getSkillsOffered());
        user.setSkillsWanted(updatedUser.getSkillsWanted());
    
        User savedUser = userService.updateUser(user);
        return ResponseEntity.ok(userService.convertToDTO(savedUser));
    }

    // Remove these duplicate methods
    // @GetMapping("/search/offering")
    // public ResponseEntity<List<UserDTO>> searchBySkillOffered(@RequestParam String skill) {
    //     return ResponseEntity.ok(userService.findUsersBySkillOffered(skill));
    // }
    // @GetMapping("/search/wanting")
    // public ResponseEntity<List<UserDTO>> searchBySkillWanted(@RequestParam String skill) {
    //     return ResponseEntity.ok(userService.findUsersBySkillWanted(skill));
    // }

    @GetMapping("/public")
    public ResponseEntity<List<UserDTO>> getAllPublicUsers() {
        return ResponseEntity.ok(userService.findAllPublicUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam(required = false) String q) {
        // Get the current user's email
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        
        List<UserDTO> results;
        if (q == null || q.isEmpty()) {
            results = userService.findAllPublicUsers();
        } else {
            // Search in both skills offered and wanted
            List<UserDTO> offeredResults = userService.findUsersBySkillOffered(q);
            List<UserDTO> wantedResults = userService.findUsersBySkillWanted(q);
            
            // Combine results and remove duplicates
            offeredResults.addAll(wantedResults);
            results = offeredResults.stream()
                    .distinct()
                    .collect(java.util.stream.Collectors.toList());
        }
        
        // Filter out the current user
        return ResponseEntity.ok(results.stream()
                .filter(user -> !user.getEmail().equals(currentUserEmail))
                .collect(java.util.stream.Collectors.toList()));
    }

    @PostMapping("/profile/image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("image") MultipartFile file,
            HttpServletRequest request) {
        try {
            // Get the current user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            
            // Store the file
            String filename = fileStorageService.storeFile(file);
            
            // Update the user's profile photo with the filename
            user.setProfilePhoto(filename);
            userService.updateUser(user);
            
            // Build the complete URL for the image
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String imageUrl = baseUrl + "/uploads/" + filename;
            
            // Return the response with the image URL
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }
}