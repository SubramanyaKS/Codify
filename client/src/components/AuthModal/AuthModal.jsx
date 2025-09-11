import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  // Prevents the modal from closing when its content is clicked
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>Unlock Your Learning Journey!</h2>
        <p>Please log in or create an account to continue watching this video</p>
        <div className="modal-actions">
          <button className="modal-button login" onClick={handleLogin}>Log In</button>
          <button className="modal-button signup" onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
