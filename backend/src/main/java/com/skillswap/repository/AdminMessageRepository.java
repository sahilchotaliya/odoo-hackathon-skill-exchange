package com.skillswap.repository;

import com.skillswap.model.AdminMessage;
import com.skillswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminMessageRepository extends JpaRepository<AdminMessage, Long> {
    List<AdminMessage> findByIsGlobalTrue();
    List<AdminMessage> findByTargetUser(User user);
}