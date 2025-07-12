package com.skillswap.repository;

import com.skillswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u JOIN u.skillsOffered s WHERE s = :skill AND u.isPublic = true AND u.isBanned = false")
    List<User> findBySkillOffered(String skill);
    
    @Query("SELECT u FROM User u JOIN u.skillsWanted s WHERE s = :skill AND u.isPublic = true AND u.isBanned = false")
    List<User> findBySkillWanted(String skill);
    
    List<User> findByIsPublicTrueAndIsBannedFalse();
}