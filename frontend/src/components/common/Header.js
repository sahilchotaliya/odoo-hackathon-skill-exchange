import React from 'react';
import { Navbar, Nav, Container, Button, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaSignOutAlt, FaExchangeAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaExchangeAlt className="me-2" />
          Skill Swap Platform
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Dropdown>
              <Dropdown.Toggle variant="light" id="category-dropdown">
                Categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Programming</Dropdown.Item>
                <Dropdown.Item>Design</Dropdown.Item>
                <Dropdown.Item>Marketing</Dropdown.Item>
                <Dropdown.Item>Language</Dropdown.Item>
                <Dropdown.Item>Music</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search skills..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-primary" type="submit">
              <FaSearch />
            </Button>
          </Form>
          
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/swaps">
                  <FaExchangeAlt className="me-1" /> My Swaps
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  <FaUser className="me-1" /> Profile
                </Nav.Link>
                {currentUser.isAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                )}
                <Button variant="outline-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;