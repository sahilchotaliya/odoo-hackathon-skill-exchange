package com.skillswap.repository;

import com.skillswap.model.SwapRequest;
import com.skillswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    List<SwapRequest> findByRequester(User requester);
    List<SwapRequest> findByReceiver(User receiver);
    List<SwapRequest> findByStatus(SwapRequest.SwapStatus status);
    // Add this missing method
    List<SwapRequest> findByReceiverAndStatus(User receiver, SwapRequest.SwapStatus status);
}