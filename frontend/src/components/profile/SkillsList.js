import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

const SkillsList = ({ skills, emptyMessage }) => {
  if (!skills || skills.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>;
  }

  return (
    <ListGroup>
      {skills.map((skill, index) => (
        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
          {skill}
          <Badge bg="primary" pill>
            {/* This could show the number of matches or other info */}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SkillsList;