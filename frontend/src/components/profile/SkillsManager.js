import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getUserSkills, updateUserSkills } from '../../services/userService';

const SkillsManager = () => {
  const [skills, setSkills] = useState({ offered: [], wanted: [] });
  const [newSkill, setNewSkill] = useState({ type: 'offered', name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getUserSkills();
        setSkills({
          offered: data.skillsOffered || [],
          wanted: data.skillsWanted || []
        });
      } catch (error) {
        toast.error('Failed to load skills');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast.warning('Please enter a skill name');
      return;
    }

    const updatedSkills = { ...skills };
    updatedSkills[newSkill.type] = [...updatedSkills[newSkill.type], newSkill.name.trim()];

    try {
      await updateUserSkills({
        skillsOffered: updatedSkills.offered,
        skillsWanted: updatedSkills.wanted
      });
      setSkills(updatedSkills);
      setNewSkill({ ...newSkill, name: '' });
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
      console.error(error);
    }
  };

  const handleRemoveSkill = async (type, skillToRemove) => {
    const updatedSkills = { ...skills };
    updatedSkills[type] = updatedSkills[type].filter(skill => skill !== skillToRemove);

    try {
      await updateUserSkills({
        skillsOffered: updatedSkills.offered,
        skillsWanted: updatedSkills.wanted
      });
      setSkills(updatedSkills);
      toast.success('Skill removed successfully');
    } catch (error) {
      toast.error('Failed to remove skill');
      console.error(error);
    }
  };

  if (loading) return <div>Loading skills...</div>;

  return (
    <Card className="skills-manager-card">
      <Card.Header>
        <h3>My Skills</h3>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h5>Add New Skill</h5>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <Form.Select
              value={newSkill.type}
              onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
            >
              <option value="offered">Skills I Offer</option>
              <option value="wanted">Skills I Want</option>
            </Form.Select>
            <Button variant="primary" onClick={handleAddSkill}>
              Add
            </Button>
          </InputGroup>
        </div>

        <div className="skills-section mb-4">
          <h5>Skills I Offer</h5>
          <div className="skills-badges">
            {skills.offered.length > 0 ? (
              skills.offered.map((skill, index) => (
                <Badge 
                  bg="primary" 
                  className="skill-badge m-1" 
                  key={`offered-${index}`}
                >
                  {skill}
                  <span 
                    className="remove-skill" 
                    onClick={() => handleRemoveSkill('offered', skill)}
                  >
                    &times;
                  </span>
                </Badge>
              ))
            ) : (
              <p className="text-muted">No skills added yet</p>
            )}
          </div>
        </div>

        <div className="skills-section">
          <h5>Skills I Want</h5>
          <div className="skills-badges">
            {skills.wanted.length > 0 ? (
              skills.wanted.map((skill, index) => (
                <Badge 
                  bg="secondary" 
                  className="skill-badge m-1" 
                  key={`wanted-${index}`}
                >
                  {skill}
                  <span 
                    className="remove-skill" 
                    onClick={() => handleRemoveSkill('wanted', skill)}
                  >
                    &times;
                  </span>
                </Badge>
              ))
            ) : (
              <p className="text-muted">No skills added yet</p>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkillsManager;