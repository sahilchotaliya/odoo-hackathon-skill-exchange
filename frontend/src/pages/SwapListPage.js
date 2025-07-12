import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button } from 'react-bootstrap';
import { getUserSwapRequests, acceptSwapRequest, rejectSwapRequest, cancelSwapRequest } from '../services/swapService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Add this import

const SwapListPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Add this line

  useEffect(() => {
    if (currentUser) { // Only fetch if user is logged in
      fetchSwapRequests();
    }
  }, [activeTab, currentUser]);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await getUserSwapRequests(activeTab);
      setSwapRequests(allRequests);
    } catch (error) {
      toast.error('Failed to load swap requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptSwapRequest(id);
      toast.success('Swap request accepted');
      fetchSwapRequests();
    } catch (error) {
      toast.error('Failed to accept request');
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectSwapRequest(id);
      toast.success('Swap request rejected');
      fetchSwapRequests();
    } catch (error) {
      toast.error('Failed to reject request');
      console.error(error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelSwapRequest(id);
      toast.success('Swap request cancelled');
      fetchSwapRequests();
    } catch (error) {
      toast.error('Failed to cancel request');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge bg="success">Accepted</Badge>;
      case 'REJECTED':
        return <Badge bg="danger">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge bg="secondary">Cancelled</Badge>;
      default:
        return <Badge bg="light">Unknown</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <h4>Swap Requests</h4>
      
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'received'} 
            onClick={() => setActiveTab('received')}
          >
            Received
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'sent'} 
            onClick={() => setActiveTab('sent')}
          >
            Sent
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      {loading ? (
        <p>Loading swap requests...</p>
      ) : swapRequests.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <p>No {activeTab} swap requests found.</p>
            {activeTab === 'sent' && (
              <Link to="/" className="btn btn-primary">Find Users to Swap With</Link>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {swapRequests.map(request => (
            <Col md={12} key={request.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Row>
                    <Col xs={2} md={1}>
                      <div className="rounded-circle bg-light d-flex justify-content-center align-items-center" 
                           style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
                        {activeTab === 'received' ? 
                          request.requesterName.charAt(0).toUpperCase() : 
                          request.receiverName.charAt(0).toUpperCase()}
                      </div>
                    </Col>
                    <Col xs={10} md={8}>
                      <h5>
                        {activeTab === 'received' ? request.requesterName : request.receiverName}
                        {' '}
                        {getStatusBadge(request.status)}
                      </h5>
                      <div className="d-flex flex-wrap">
                        <div className="me-4 mb-2">
                          <small className="text-muted">Skill Offered:</small>
                          <div>
                            <Badge bg="light" text="dark">{request.skillOffered}</Badge>
                          </div>
                        </div>
                        <div>
                          <small className="text-muted">Skill Wanted:</small>
                          <div>
                            <Badge bg="light" text="dark">{request.skillWanted}</Badge>
                          </div>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mt-2">
                          <small className="text-muted">Message:</small>
                          <p className="mb-0">{request.message}</p>
                        </div>
                      )}
                    </Col>
                    <Col xs={12} md={3} className="d-flex justify-content-end align-items-center">
                      {activeTab === 'received' && request.status === 'PENDING' && (
                        <>
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleAccept(request.id)}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {activeTab === 'sent' && request.status === 'PENDING' && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleCancel(request.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SwapListPage;