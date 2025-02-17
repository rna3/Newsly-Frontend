import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './styles/Navbar.module.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

     // Handle click on the logo (Newsly link)
    const handleLogoClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Prevent default link navigation.
      navigate('/login');
    }
  };

    return (
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/" onClick={handleLogoClick}>Newsly</Link>
          </div>
          <ul className={styles.navLinks}>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/favorites">Favorites</Link>
                </li>
                <li>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    );
  };

export default Navbar;
