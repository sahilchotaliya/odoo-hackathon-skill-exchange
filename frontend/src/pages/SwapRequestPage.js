import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import SwapRequestForm from '../components/swap/SwapRequestForm';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Add this import

const SwapRequestPage = () => {
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get current user
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('userId');
    
    if (!id) {
      toast.error('No user selected for swap request');
      navigate('/search');
      return;
    }
    
    // Add a check to prevent requesting swap with yourself
    if (id === currentUser?.id) {
      toast.error('You cannot request a swap with yourself');
      navigate('/search');
      return;
    }
    
    setUserId(id);
  }, [location, navigate, currentUser]);

  return (
    <Container>
      <h2 className="my-4">Create Swap Request</h2>
      {userId && <SwapRequestForm receiverId={userId} />}
    </Container>
  );
};

export default SwapRequestPage;