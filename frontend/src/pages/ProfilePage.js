import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUserProfile, uploadProfileImage } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';

const ProfilePage = () => {
  const { id } = useParams();
  const { currentUser, updateCurrentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skillsOffered: '',
    skillsWanted: '',
    isPublic: true,
    profileImage: ''
  });

  const isOwnProfile = !id || (currentUser && currentUser.id.toString() === id);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userData;
        if (isOwnProfile) {
          userData = currentUser;
        } else {
          userData = await getUserById(id);
        }
        
        setUser(userData);
        setFormData({
          name: userData.name || '',
          location: userData.location || '',
          skillsOffered: userData.skillsOffered?.join(', ') || '',
          skillsWanted: userData.skillsWanted?.join(', ') || '',
          isPublic: userData.isPublic !== false,
          profileImage: userData.profileImage || ''
        });
      } catch (error) {
        toast.error('Failed to load profile data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser, isOwnProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageClick = () => {
    if (isOwnProfile && editing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await uploadProfileImage(formData);
        
        // Debug log
        console.log('Image URL from server:', response.imageUrl);
        
        // Update the form data with the new image URL from the response
        setFormData(prev => ({
          ...prev,
          profileImage: response.imageUrl // Make sure this matches your API response structure
        }));
        
        // If not in edit mode, update the user state directly
        if (!editing) {
          setUser(prev => ({
            ...prev,
            profileImage: response.imageUrl
          }));
          
          // Update current user in context if it's own profile
          if (isOwnProfile && updateCurrentUser) {
            updateCurrentUser({
              ...currentUser,
              profileImage: response.imageUrl
            });
          }
        }
        
        toast.success('Profile image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload profile image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        skillsOffered: formData.skillsOffered.split(',').map(skill => skill.trim()).filter(Boolean),
        skillsWanted: formData.skillsWanted.split(',').map(skill => skill.trim()).filter(Boolean)
      };
      
      await updateUserProfile(updatedData);
      setUser(prev => ({
        ...prev,
        ...updatedData,
        skillsOffered: updatedData.skillsOffered,
        skillsWanted: updatedData.skillsWanted,
        profileImage: formData.profileImage
      }));
      
      // Update current user in context if it's own profile
      if (isOwnProfile && updateCurrentUser) {
        updateCurrentUser({
          ...currentUser,
          ...updatedData,
          profileImage: formData.profileImage
        });
      }
      
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleSwapRequest = () => {
    if (!currentUser) {
      toast.info('Please login to request a skill swap');
      navigate('/login');
      return;
    }
    navigate(`/swaps/new?userId=${id}`);
  };
  
  // And update the button rendering condition
  {!isOwnProfile && currentUser && (
    <Button 
      variant="primary" 
      onClick={handleSwapRequest}
    >
      Request Swap
    </Button>
  )}

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h4>{isOwnProfile ? 'Your Profile' : `${user.name}'s Profile`}</h4>
              {isOwnProfile && (
                <Button 
                  variant={editing ? "secondary" : "primary"} 
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </Button>
              )}
              {!isOwnProfile && currentUser && (
                <Button 
                  variant="primary" 
                  onClick={handleSwapRequest}
                >
                  Request Swap
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col xs={12} className="text-center">
                  <div 
                    className="position-relative d-inline-block" 
                    style={{ cursor: isOwnProfile && editing ? 'pointer' : 'default' }}
                    onClick={handleImageClick}
                  >
                   {formData.profileImage ? (
                      <Image 
                        src={formData.profileImage} 
                        roundedCircle 
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                        onError={(e) => {
                          console.error('Image failed to load:', formData.profileImage);
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                        }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-light d-flex justify-content-center align-items-center" 
                        style={{ width: '150px', height: '150px', margin: '0 auto' }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    {isOwnProfile && editing && (
                      <div 
                        className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <FaCamera color="white" size={20} />
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Col>
              </Row>
              
              {editing ? (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="location" 
                          value={formData.location} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Skills Offered</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="skillsOffered" 
                          value={formData.skillsOffered} 
                          onChange={handleChange} 
                          placeholder="Separate skills with commas"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Skills Wanted</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="skillsWanted" 
                          value={formData.skillsWanted} 
                          onChange={handleChange} 
                          placeholder="Separate skills with commas"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={12} className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="isPublic"
                        name="isPublic"
                        label="Public Profile"
                        checked={formData.isPublic}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  
                  <div className="text-center mt-3">
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </div>
                </Form>
              ) : (
                <Row>
                  <Col md={12} className="mb-3">
                    <h5>Name</h5>
                    <p>{user.name}</p>
                  </Col>
                  
                  <Col md={12} className="mb-3">
                    <h5>Location</h5>
                    <p>{user.location || 'Not specified'}</p>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <h5>Skills Offered</h5>
                    <div>
                      {user.skillsOffered?.length > 0 ? (
                        user.skillsOffered.map((skill, index) => (
                          <Badge key={index} bg="light" text="dark" className="me-1 mb-1">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-muted">No skills offered</p>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <h5>Skills Wanted</h5>
                    <div>
                      {user.skillsWanted?.length > 0 ? (
                        user.skillsWanted.map((skill, index) => (
                          <Badge key={index} bg="light" text="dark" className="me-1 mb-1">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-muted">No skills wanted</p>
                      )}
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;