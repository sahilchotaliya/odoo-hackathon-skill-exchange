import React, { useState, useEffect } from 'react';
import { Form, Button, Card, InputGroup, Row, Col, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { searchUsers } from '../../services/userService';
import { FaSearch } from 'react-icons/fa';

const UserSearch = ({ isAuthenticated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const results = await searchUsers('');
        setSearchResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (userId) => {
    if (!isAuthenticated) {
      toast.info('Please login to request a skill swap');
      navigate('/login');
      return;
    }
    navigate(`/swaps/new?userId=${userId}`);
  };

  return (
    <div className="user-search-container">
      {/* Search Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Skill Swap Platform</h4>
        <Form onSubmit={handleSearch} className="d-flex">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Button variant="outline-secondary" type="submit">
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          {searchResults.map((user) => (
            <Card key={user.id} className="mb-3 user-card">
              <Card.Body>
                <Row>
                  <Col xs={2} md={1}>
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </Col>
                  <Col xs={10} md={8}>
                    <h5>{user.name}</h5>
                    <div className="d-flex flex-wrap">
                      <div className="me-4 mb-2">
                        <small className="text-muted">Skills Offered:</small>
                        <div>
                          {user.skillsOffered?.map((skill, index) => (
                            <Badge key={index} bg="light" text="dark" className="skill-badge">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <small className="text-muted">Skills Wanted:</small>
                        <div>
                          {user.skillsWanted?.map((skill, index) => (
                            <Badge key={index} bg="light" text="dark" className="skill-badge">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={3} className="d-flex justify-content-end align-items-center">
                    <Link to={`/profile/${user.id}`} className="btn btn-outline-primary btn-sm me-2 rounded-pill">
                      View Profile
                    </Link>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="rounded-pill"
                      onClick={() => handleRequestClick(user.id)}
                    >
                      Swap
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          <div className="pagination-dots text-center mt-4">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p>No users found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;