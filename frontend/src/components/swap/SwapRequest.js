import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUserSkills } from '../../services/userService';
import { createSwapRequest } from '../../services/swapService';

const SwapRequest = ({ receiverId, receiverName }) => {
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState({ offered: [], wanted: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        setLoading(true);
        const data = await getUserSkills();
        setUserSkills({
          offered: data.skillsOffered || [],
          wanted: data.skillsWanted || []
        });
      } catch (err) {
        setError('Failed to load your skills');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSkills();
  }, []);

  const initialValues = {
    skillOffered: '',
    skillWanted: '',
    message: ''
  };

  const validationSchema = Yup.object({
    skillOffered: Yup.string().required('Please select a skill to offer'),
    skillWanted: Yup.string().required('Please select a skill you want'),
    message: Yup.string().max(500, 'Message must be 500 characters or less')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await createSwapRequest({
        ...values,
        receiverId
      });
      resetForm();
      navigate('/swaps', { state: { success: true } });
    } catch (err) {
      setError('Failed to create swap request');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">
                {receiverName ? `Request Skill Swap with ${receiverName}` : 'Create Skill Swap Request'}
              </h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Skill You Offer</Form.Label>
                      <Field as="select" name="skillOffered" className="form-select">
                        <option value="">Select a skill you can offer</option>
                        {userSkills.offered.map((skill, index) => (
                          <option key={index} value={skill}>{skill}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="skillOffered" component="div" className="text-danger" />
                      {userSkills.offered.length === 0 && (
                        <div className="text-warning mt-1">
                          You haven't added any skills you offer. <a href="/profile">Update your profile</a> first.
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Skill You Want</Form.Label>
                      <Field as="select" name="skillWanted" className="form-select">
                        <option value="">Select a skill you want to learn</option>
                        {userSkills.wanted.map((skill, index) => (
                          <option key={index} value={skill}>{skill}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="skillWanted" component="div" className="text-danger" />
                      {userSkills.wanted.length === 0 && (
                        <div className="text-warning mt-1">
                          You haven't added any skills you want. <a href="/profile">Update your profile</a> first.
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Message (Optional)</Form.Label>
                      <Field 
                        as="textarea" 
                        name="message" 
                        className="form-control" 
                        rows={4} 
                        placeholder="Introduce yourself and explain why you want to swap skills"
                      />
                      <ErrorMessage name="message" component="div" className="text-danger" />
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="secondary" onClick={() => navigate(-1)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isSubmitting || userSkills.offered.length === 0 || userSkills.wanted.length === 0}
                      >
                        {isSubmitting ? 'Sending Request...' : 'Send Swap Request'}
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

export default SwapRequest;