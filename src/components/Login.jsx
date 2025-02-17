import React, { useState, useContext } from 'react';
import api from '../api.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Post credentials to the backend login endpoint
      const res = await api.post('/auth/login', { email, password });
      // Save the JWT token in localStorage for authenticated requests
      login(res.data.token);
      alert('Login successful');
      // Redirect to the NewsSearch page after successful login
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2 className={styles.title}>Login</h2>
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
        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
