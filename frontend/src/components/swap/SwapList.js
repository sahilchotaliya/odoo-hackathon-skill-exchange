import React, { useState, useEffect } from 'react';
import { Card, Nav, Table, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getUserSwapRequests, getPendingSwapRequests, acceptSwapRequest, rejectSwapRequest, cancelSwapRequest } from '../../services/swapService';

const SwapList = () => {
  const [activeTab, setActiveTab] = useState('sent');
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwaps();
  }, [activeTab]);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'sent') {
        data = await getUserSwapRequests();
      } else {
        data = await getPendingSwapRequests();
      }
      setSwaps(data);
    } catch (error) {
      toast.error(`Failed to load ${activeTab} swap requests`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (swapId) => {
    try {
      await acceptSwapRequest(swapId);
      toast.success('Swap request accepted');
      fetchSwaps();
    } catch (error) {
      toast.error('Failed to accept swap request');
      console.error(error);
    }
  };

  const handleReject = async (swapId) => {
    try {
      await rejectSwapRequest(swapId);
      toast.success('Swap request rejected');
      fetchSwaps();
    } catch (error) {
      toast.error('Failed to reject swap request');
      console.error(error);
    }
  };

  const handleCancel = async (swapId) => {
    try {
      await cancelSwapRequest(swapId);
      toast.success('Swap request cancelled');
      fetchSwaps();
    } catch (error) {
      toast.error('Failed to cancel swap request');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { bg: 'warning', text: 'Pending' },
      ACCEPTED: { bg: 'success', text: 'Accepted' },
      REJECTED: { bg: 'danger', text: 'Rejected' },
      CANCELLED: { bg: 'secondary', text: 'Cancelled' }
    };
    
    const { bg, text } = statusMap[status] || { bg: 'info', text: status };
    return <Badge bg={bg}>{text}</Badge>;
  };

  return (
    <Card className="swap-list-card">
      <Card.Header>
        <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
          <Nav.Item>
            <Nav.Link eventKey="sent">Sent Requests</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="received">Received Requests</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div>Loading swap requests...</div>
        ) : swaps.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No {activeTab} swap requests found</p>
          </div>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>{activeTab === 'sent' ? 'To' : 'From'}</th>
                <th>Skill Offered</th>
                <th>Skill Wanted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {swaps.map((swap) => (
                <tr key={swap.id}>
                  <td>{activeTab === 'sent' ? swap.receiver.name : swap.requester.name}</td>
                  <td>{swap.skillOffered}</td>
                  <td>{swap.skillWanted}</td>
                  <td>{getStatusBadge(swap.status)}</td>
                  <td>
                    {activeTab === 'sent' && swap.status === 'PENDING' && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleCancel(swap.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    {activeTab === 'received' && swap.status === 'PENDING' && (
                      <>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleAccept(swap.id)}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleReject(swap.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default SwapList;