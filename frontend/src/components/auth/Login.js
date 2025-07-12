import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.password);
      navigate('/profile');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <h4>Skill Swap Platform</h4>
            <p className="text-muted">User Login</p>
          </div>
          <Card className="shadow border-0 login-card">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="form-control" 
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field 
                        type="password" 
                        id="password" 
                        name="password" 
                        className="form-control" 
                        placeholder="Enter your password"
                      />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>

                    <div className="text-center mb-3">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isSubmitting}
                        className="login-btn rounded-pill"
                      >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                    
                    <div className="text-center mt-3">
                      <p className="text-muted">Forgot your password? <Link to="/forgot-password" className="text-decoration-none">Reset Password</Link></p>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            <Link to="/" className="btn btn-outline-secondary rounded-pill">Back</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;