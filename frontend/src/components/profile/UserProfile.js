import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import SkillsList from './SkillsList';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({ type: 'offered', name: '' });

  // Form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        
        // Initialize form fields
        setName(data.name || '');
        setLocation(data.location || '');
        setAvailability(data.availability || '');
        setIsPublic(data.isPublic);
        setSkillsOffered(data.skillsOffered || []);
        setSkillsWanted(data.skillsWanted || []);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        name,
        location,
        availability,
        isPublic,
        skillsOffered,
        skillsWanted
      };

      await updateUserProfile(updatedProfile);
      setProfile(updatedProfile);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    if (newSkill.type === 'offered') {
      setSkillsOffered([...skillsOffered, newSkill.name]);
    } else {
      setSkillsWanted([...skillsWanted, newSkill.name]);
    }
    
    setNewSkill({ ...newSkill, name: '' });
  };

  const handleRemoveSkill = (type, index) => {
    if (type === 'offered') {
      const updated = [...skillsOffered];
      updated.splice(index, 1);
      setSkillsOffered(updated);
    } else {
      const updated = [...skillsWanted];
      updated.splice(index, 1);
      setSkillsWanted(updated);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
              <h3 className="mb-0">My Profile</h3>
              <Button 
                variant={editing ? "light" : "outline-light"} 
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : <><FaEdit /> Edit</>}
              </Button>
            </Card.Header>
            <Card.Body>
              {editing ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Availability</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={availability} 
                      onChange={(e) => setAvailability(e.target.value)} 
                      placeholder="e.g., Weekends, Evenings, etc."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox" 
                      label="Make my profile public" 
                      checked={isPublic} 
                      onChange={(e) => setIsPublic(e.target.checked)} 
                    />
                  </Form.Group>

                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>Skills I Offer</h5>
                      <ListGroup className="mb-3">
                        {skillsOffered.map((skill, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            {skill}
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleRemoveSkill('offered', index)}
                            >
                              <FaTrash />
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <h5>Skills I Want</h5>
                      <ListGroup className="mb-3">
                        {skillsWanted.map((skill, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            {skill}
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleRemoveSkill('wanted', index)}
                            >
                              <FaTrash />
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <h5>Add New Skill</h5>
                    <Row className="align-items-end">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Skill Type</Form.Label>
                          <Form.Select 
                            value={newSkill.type} 
                            onChange={(e) => setNewSkill({...newSkill, type: e.target.value})}
                          >
                            <option value="offered">Skill I Offer</option>
                            <option value="wanted">Skill I Want</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Skill Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={newSkill.name} 
                            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} 
                            placeholder="e.g., JavaScript, Cooking, etc."
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Button 
                          variant="success" 
                          onClick={handleAddSkill} 
                          className="w-100"
                        >
                          <FaPlus />
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <Row>
                    <Col md={6}>
                      <p><strong>Name:</strong> {profile.name}</p>
                      {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                    </Col>
                    <Col md={6}>
                      <p><strong>Availability:</strong> {profile.availability || 'Not specified'}</p>
                      <p>
                        <strong>Profile Status:</strong> 
                        <Badge bg={profile.isPublic ? 'success' : 'secondary'} className="ms-2">
                          {profile.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </p>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>Skills I Offer</h5>
                      <SkillsList skills={profile.skillsOffered} emptyMessage="No skills offered yet" />
                    </Col>
                    <Col md={6}>
                      <h5>Skills I Want</h5>
                      <SkillsList skills={profile.skillsWanted} emptyMessage="No skills wanted yet" />
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;