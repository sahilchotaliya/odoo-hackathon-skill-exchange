import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Table, Badge, Form, Button } from 'react-bootstrap';
import { getAllSwaps } from '../services/swapService';
import { getAllUsers } from '../services/userService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [swaps, setSwaps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const swapData = await getAllSwaps();
        setSwaps(swapData);
        
        // Calculate stats
        const newStats = {
          total: swapData.length,
          pending: swapData.filter(swap => swap.status === 'PENDING').length,
          accepted: swapData.filter(swap => swap.status === 'ACCEPTED').length,
          rejected: swapData.filter(swap => swap.status === 'REJECTED').length,
          cancelled: swapData.filter(swap => swap.status === 'CANCELLED').length
        };
        setStats(newStats);

        // Fetch users if on users tab
        if (activeTab === 'users') {
          const userData = await getAllUsers();
          setUsers(userData);
        }
      } catch (error) {
        toast.error('Failed to load admin data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

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

  // Filter swaps based on search term
  const filteredSwaps = swaps.filter(swap => 
    swap.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.skillOffered?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.skillWanted?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSwaps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSwaps.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="admin-sidebar d-none d-md-block">
          <Card className="sidebar-card">
            <Card.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link 
                  className={activeTab === 'overview' ? 'active' : ''}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'swaps' ? 'active' : ''}
                  onClick={() => setActiveTab('swaps')}
                >
                  Manage Swaps
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'users' ? 'active' : ''}
                  onClick={() => setActiveTab('users')}
                >
                  Manage Users
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'feedback' ? 'active' : ''}
                  onClick={() => setActiveTab('feedback')}
                >
                  Rating and Feedback
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9} lg={10}>
          <h2 className="my-4">Admin Dashboard</h2>
          
          {activeTab === 'overview' && (
            <Row>
              <Col md={3} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <h3>{stats.total}</h3>
                    <p className="text-muted mb-0">Total Swaps</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <h3>{stats.pending}</h3>
                    <p className="text-muted mb-0">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <h3>{stats.accepted}</h3>
                    <p className="text-muted mb-0">Accepted</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <h3>{stats.rejected + stats.cancelled}</h3>
                    <p className="text-muted mb-0">Rejected/Cancelled</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          
          {activeTab === 'swaps' && (
            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">All Swap Requests</h5>
                  </Col>
                  <Col md={4}>
                    <Form.Control 
                      type="text" 
                      placeholder="Search swaps..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div>Loading swap data...</div>
                ) : (
                  <>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Requester</th>
                          <th>Receiver</th>
                          <th>Skills</th>
                          <th>Status</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((swap) => (
                          <tr key={swap.id}>
                            <td>{swap.id}</td>
                            <td>{swap.requester?.name}</td>
                            <td>{swap.receiver?.name}</td>
                            <td>
                              <small>
                                <strong>Offered:</strong> {swap.skillOffered}<br />
                                <strong>Wanted:</strong> {swap.skillWanted}
                              </small>
                            </td>
                            <td>{getStatusBadge(swap.status)}</td>
                            <td>{new Date(swap.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                      <Nav>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <Nav.Item key={i}>
                            <Nav.Link 
                              onClick={() => paginate(i + 1)}
                              className={currentPage === i + 1 ? 'active' : ''}
                            >
                              {i + 1}
                            </Nav.Link>
                          </Nav.Item>
                        ))}
                      </Nav>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
          
          {activeTab === 'users' && (
            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">User Management</h5>
                  </Col>
                  <Col md={4}>
                    <Form.Control 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <p>User management functionality will be implemented in the next phase.</p>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Login
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <a href="#">Forgot Password?</a>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
          
          {activeTab === 'feedback' && (
            <Card>
              <Card.Body>
                <p>Feedback management functionality will be implemented in the next phase.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;