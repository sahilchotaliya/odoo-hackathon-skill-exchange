import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserById } from '../../services/userService';
import { createSwapRequest } from '../../services/swapService';

const SwapRequestForm = ({ receiverId }) => {
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceiverData = async () => {
      if (!receiverId) return;
      
      try {
        const userData = await getUserById(receiverId);
        setReceiver(userData);
      } catch (error) {
        toast.error('Failed to load user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiverData();
  }, [receiverId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.skillOffered || !formData.skillWanted) {
      toast.warning('Please select both skills');
      return;
    }

    try {
      // Add a check for authentication here
      await createSwapRequest({
        receiverId,
        ...formData
      });
      toast.success('Swap request sent successfully');
      navigate('/swaps');
    } catch (error) {
      // Improve error handling with more specific messages
      const errorMessage = error.response?.data?.message || 'Failed to send swap request';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!receiver) return <div>User not found</div>;

  return (
    <Card className="swap-request-card">
      <Card.Header>
        <h3>Create Swap Request</h3>
      </Card.Header>
      <Card.Body>
        <p>Requesting skill swap with: <strong>{receiver.name}</strong></p>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Skill You Offer</Form.Label>
            <Form.Select 
              name="skillOffered"
              value={formData.skillOffered}
              onChange={handleChange}
              required
            >
              <option value="">Select a skill you can offer</option>
              {receiver.skillsWanted?.map((skill, index) => (
                <option key={`wanted-${index}`} value={skill}>{skill}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Skill You Want</Form.Label>
            <Form.Select 
              name="skillWanted"
              value={formData.skillWanted}
              onChange={handleChange}
              required
            >
              <option value="">Select a skill you want</option>
              {receiver.skillsOffered?.map((skill, index) => (
                <option key={`offered-${index}`} value={skill}>{skill}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add a message to your request"
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Request
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SwapRequestForm;