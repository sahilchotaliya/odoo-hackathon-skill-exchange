import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert, Form as BootstrapForm } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    skillsOffered: '',
    skillsWanted: '',
    isPublic: true
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    location: Yup.string().required('Location is required'),
    skillsOffered: Yup.string().required('Please enter at least one skill you offer'),
    skillsWanted: Yup.string().required('Please enter at least one skill you want')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Convert comma-separated skills to arrays
      const userData = {
        ...values,
        skillsOffered: values.skillsOffered.split(',').map(skill => skill.trim()),
        skillsWanted: values.skillsWanted.split(',').map(skill => skill.trim()),
        role: 'USER'
      };
      
      delete userData.confirmPassword;
      
      await register(userData);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-0">
            <Card.Header className="bg-white text-center border-0 pt-4">
              <h4>Your Profile</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, handleChange }) => (
                  <Form>
                    <Row>
                      <Col md={12} className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <Field 
                          type="text" 
                          id="name" 
                          name="name" 
                          className="form-control" 
                        />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={12} className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <Field 
                          type="text" 
                          id="location" 
                          name="location" 
                          className="form-control" 
                        />
                        <ErrorMessage name="location" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <label htmlFor="skillsOffered" className="form-label">Skills Offered</label>
                        <Field 
                          type="text" 
                          id="skillsOffered" 
                          name="skillsOffered" 
                          className="form-control" 
                          placeholder="Separate skills with commas"
                        />
                        <ErrorMessage name="skillsOffered" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <label htmlFor="skillsWanted" className="form-label">Skills Wanted</label>
                        <Field 
                          type="text" 
                          id="skillsWanted" 
                          name="skillsWanted" 
                          className="form-control" 
                          placeholder="Separate skills with commas"
                        />
                        <ErrorMessage name="skillsWanted" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={12} className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <Field 
                          type="email" 
                          id="email" 
                          name="email" 
                          className="form-control" 
                        />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <Field 
                          type="password" 
                          id="password" 
                          name="password" 
                          className="form-control" 
                        />
                        <ErrorMessage name="password" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <Field 
                          type="password" 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          className="form-control" 
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                      </Col>
                      
                      <Col md={12} className="mb-3">
                        <BootstrapForm.Check 
                          type="switch"
                          id="isPublic"
                          name="isPublic"
                          label="Public Profile"
                          checked={values.isPublic}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>

                    <div className="text-center mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-4 py-2"
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;