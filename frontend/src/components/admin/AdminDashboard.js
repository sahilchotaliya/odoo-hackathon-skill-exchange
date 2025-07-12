import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import UserManagement from './UserManagement';
import SwapManagement from './SwapManagement';
import Reports from './Reports';
import MessageCenter from './MessageCenter';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    // Set the active tab based on the current route
    const path = window.location.pathname;
    if (path.includes('/admin/users')) setActiveTab('users');
    else if (path.includes('/admin/swaps')) setActiveTab('swaps');
    else if (path.includes('/admin/reports')) setActiveTab('reports');
    else if (path.includes('/admin/messages')) setActiveTab('messages');
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
  };

  return (
    <Container fluid className="admin-dashboard">
      <Row>
        <Col md={3} lg={2} className="admin-sidebar">
          <Card className="sidebar-card">
            <Card.Header>
              <h4>Admin Panel</h4>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column" activeKey={activeTab} onSelect={handleTabChange}>
                <Nav.Link eventKey="users">User Management</Nav.Link>
                <Nav.Link eventKey="swaps">Swap Management</Nav.Link>
                <Nav.Link eventKey="reports">Reports</Nav.Link>
                <Nav.Link eventKey="messages">Message Center</Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9} lg={10} className="admin-content">
          <Routes>
            <Route path="/" element={<UserManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/swaps" element={<SwapManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<MessageCenter />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;