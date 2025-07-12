package com.skillswap.service;

import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    public List<Message> getUserMessages() {
        User currentUser = userService.getCurrentUserEntity();
        List<Message> userMessages = messageRepository.findByRecipient(currentUser);
        List<Message> systemMessages = messageRepository.findByIsSystemWideTrue();
        
        List<Message> allMessages = new ArrayList<>(userMessages);
        allMessages.addAll(systemMessages);
        
        return allMessages;
    }

    public Message sendMessage(Message message) {
        User currentUser = userService.getCurrentUserEntity();
        // Assuming you have a method to get User entity by ID
        User recipient = userService.getUserEntityById(message.getRecipient().getId());
        
        message.setSender(currentUser);
        message.setRecipient(recipient);
        message.setSystemWide(false);
        message.setCreatedAt(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    public Message sendSystemMessage(Message message) {
        User currentUser = userService.getCurrentUserEntity();
        
        message.setSender(currentUser);
        message.setRecipient(null);
        message.setSystemWide(true);
        message.setCreatedAt(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    public Message markAsRead(Long id) {
        User currentUser = userService.getCurrentUserEntity();
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
        
        if (message.getRecipient() != null && !message.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only mark your own messages as read");
        }
        
        message.setRead(true);
        return messageRepository.save(message);
    }
}