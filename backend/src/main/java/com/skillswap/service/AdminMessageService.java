package com.skillswap.service;

import com.skillswap.model.AdminMessage;
import com.skillswap.model.User;
import com.skillswap.repository.AdminMessageRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminMessageService {

    @Autowired
    private AdminMessageRepository adminMessageRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminMessage createGlobalMessage(String title, String content) {
        AdminMessage message = new AdminMessage();
        message.setTitle(title);
        message.setContent(content);
        message.setGlobal(true);
        message.setCreatedAt(LocalDateTime.now());
        return adminMessageRepository.save(message);
    }

    public AdminMessage createUserMessage(Long userId, String title, String content) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        AdminMessage message = new AdminMessage();
        message.setTitle(title);
        message.setContent(content);
        message.setGlobal(false);
        message.setTargetUser(user);
        message.setCreatedAt(LocalDateTime.now());
        return adminMessageRepository.save(message);
    }

    public List<AdminMessage> getGlobalMessages() {
        return adminMessageRepository.findByIsGlobalTrue();
    }

    public List<AdminMessage> getUserMessages(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return adminMessageRepository.findByTargetUser(user);
    }

    public List<AdminMessage> getAllMessages() {
        return adminMessageRepository.findAll();
    }
}