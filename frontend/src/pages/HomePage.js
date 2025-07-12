import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { getAllUsers, searchUsers } from '../services/userService';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaSearch, FaUserFriends } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchUsers(searchTerm);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="my-5">
        <Col md={7} className="d-flex flex-column justify-content-center">
          <h1 className="display-4 fw-bold">Skill Swap Platform</h1>
          <p className="lead my-4">
            Connect with others, exchange skills, and learn something new today! Our platform helps you find people with the skills you want to learn, and share your own expertise.
          </p>
          {!currentUser && (
            <div className="mt-4">
              <Link to="/register" className="btn btn-primary me-3 px-4 py-2">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-outline-primary px-4 py-2">
                Login
              </Link>
            </div>
          )}
        </Col>
        <Col md={5} className="d-flex align-items-center justify-content-center">
          <img 
            src="/images/skill-exchange-illustration.svg" 
            alt="Skill Exchange Illustration" 
            className="img-fluid" 
            style={{ maxHeight: '400px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Skill+Exchange';
            }}
          />
        </Col>
      </Row>

      <Row className="my-5 py-5 bg-light rounded">
        <Col xs={12} className="text-center mb-4">
          <h2>How It Works</h2>
          <p className="text-muted">Exchange skills in three simple steps</p>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center p-4 border-0 shadow-sm">
            <div className="mb-3 fs-1 text-primary">
              <FaSearch />
            </div>
            <Card.Title>Find Skills</Card.Title>
            <Card.Text>
              Search for people offering the skills you want to learn.
            </Card.Text>
            <div className="mt-auto pt-3">
              <Link to="/search" className="btn btn-outline-primary rounded-pill px-4">
                Search Now
              </Link>
            </div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center p-4 border-0 shadow-sm">
            <div className="mb-3 fs-1 text-primary">
              <FaExchangeAlt />
            </div>
            <Card.Title>Request Swaps</Card.Title>
            <Card.Text>
              Request to exchange your skills with others in the community.
            </Card.Text>
            <div className="mt-auto pt-3">
              <Link to="/swaps/new" className="btn btn-outline-primary rounded-pill px-4">
                Create Request
              </Link>
            </div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center p-4 border-0 shadow-sm">
            <div className="mb-3 fs-1 text-primary">
              <FaUserFriends />
            </div>
            <Card.Title>Manage Profile</Card.Title>
            <Card.Text>
              Update your profile and manage the skills you offer and want.
            </Card.Text>
            <div className="mt-auto pt-3">
              <Link to="/profile" className="btn btn-outline-primary rounded-pill px-4">
                My Profile
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="my-5 text-center">
        <Col>
          <h2>Join Our Community Today</h2>
          <p className="lead mb-4">Start exchanging skills and expanding your knowledge</p>
          {!currentUser && (
            <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 rounded-pill">
              Get Started
            </Link>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;