import React from 'react';
import { Container } from 'react-bootstrap';
import UserSearch from '../components/search/UserSearch';
import { useAuth } from '../context/AuthContext';

const UserSearchPage = () => {
  const { currentUser } = useAuth();
  
  return (
    <Container>
      <h2 className="my-4">Skill Swap Platform</h2>
      <UserSearch isAuthenticated={!!currentUser} />
    </Container>
  );
};

export default UserSearchPage;