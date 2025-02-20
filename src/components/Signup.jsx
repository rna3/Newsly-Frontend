import React, { useState, useContext } from 'react';
import api from '../api.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './styles/Signup.module.css';

const Signup = () => {
  // Local state for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Call the registration endpoint with user details
      const res = await api.post('auth/register', {
        username,
        email,
        password,
      });
      // Store token for future authenticated requests:
      login(res.data.token);
      alert('Signup successful! You can now log in.');
      // Redirect to the NewsSearch page after successful signup
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSignup}>
        <h2 className={styles.title}>Signup</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <p className={styles.passwordRequirements}>
          Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
        </p>
        <button type="submit" className={styles.submitBtn}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
