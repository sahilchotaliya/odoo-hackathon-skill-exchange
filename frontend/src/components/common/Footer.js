import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaExchangeAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="mb-3">
              <FaExchangeAlt className="me-2" />
              Skill Swap
            </h5>
            <p className="text-muted">
              Connect with others to exchange skills and knowledge. Learn something new today!
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-light">Home</Link></li>
              <li><Link to="/search" className="text-decoration-none text-light">Find Skills</Link></li>
              <li><Link to="/profile" className="text-decoration-none text-light">My Profile</Link></li>
              <li><Link to="/swaps" className="text-decoration-none text-light">My Swaps</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Connect With Us</h5>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-light"><FaGithub /></a>
              <a href="#" className="text-light"><FaTwitter /></a>
              <a href="#" className="text-light"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center text-muted">
            <small>&copy; {new Date().getFullYear()} Skill Swap Platform. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;