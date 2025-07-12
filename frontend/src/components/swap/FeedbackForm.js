import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaStar } from 'react-icons/fa';
import { submitFeedback } from '../../services/swapService';

const FeedbackForm = ({ swap, onClose }) => {
  const initialValues = {
    rating: 5,
    comment: ''
  };

  const validationSchema = Yup.object({
    rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1'),
    comment: Yup.string().max(500, 'Comment must be 500 characters or less')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await submitFeedback(swap.id, values);
      onClose();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = ({ field, form }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i}
          className={`star ${i <= field.value ? 'filled' : 'empty'}`}
          onClick={() => form.setFieldValue(field.name, i)}
          style={{ 
            cursor: 'pointer', 
            fontSize: '2rem', 
            color: i <= field.value ? '#ffc107' : '#e4e5e9',
            marginRight: '5px'
          }}
        />
      );
    }
    return <div className="d-flex">{stars}</div>;
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate Your Experience</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <p>
                Please rate your experience with {swap.requesterId === 'currentUserId' ? swap.receiverName : swap.requesterName} 
                for the skill swap: <strong>{swap.skillOffered}</strong> for <strong>{swap.skillWanted}</strong>
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <Field name="rating" component={renderStars} />
                <ErrorMessage name="rating" component="div" className="text-danger" />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Comments (Optional)</Form.Label>
                <Field 
                  as="textarea" 
                  name="comment" 
                  className="form-control" 
                  rows={4} 
                  placeholder="Share your experience with this skill swap"
                />
                <ErrorMessage name="comment" component="div" className="text-danger" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default FeedbackForm;