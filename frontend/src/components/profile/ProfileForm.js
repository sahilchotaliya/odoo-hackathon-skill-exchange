import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile, toggleProfileVisibility } from '../../services/userService';

const ProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    location: Yup.string(),
    availability: Yup.string().required('Availability is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateUserProfile(values);
      toast.success('Profile updated successfully');
      setProfile(values);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisibilityToggle = async () => {
    try {
      const updatedProfile = await toggleProfileVisibility(!profile.isPublic);
      setProfile({ ...profile, isPublic: updatedProfile.isPublic });
      toast.success(`Profile is now ${updatedProfile.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      toast.error('Failed to update profile visibility');
      console.error(error);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Failed to load profile</div>;

  return (
    <Card className="profile-form-card">
      <Card.Header>
        <h3>My Profile</h3>
      </Card.Header>
      <Card.Body>
        <Formik
          initialValues={{
            name: profile.name || '',
            email: profile.email || '',
            location: profile.location || '',
            availability: profile.availability || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Field
                      as={Form.Control}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="location"
                      placeholder="Enter your location (optional)"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Availability</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="availability"
                      placeholder="e.g., Weekends, Evenings"
                    />
                    <ErrorMessage name="availability" component="div" className="text-danger" />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <Form.Check
                  type="switch"
                  id="profile-visibility"
                  label={`Profile is ${profile.isPublic ? 'public' : 'private'}`}
                  checked={profile.isPublic}
                  onChange={handleVisibilityToggle}
                />
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default ProfileForm;