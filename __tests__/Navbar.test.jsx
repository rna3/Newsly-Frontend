import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../src/components/Navbar';
import { AuthContext } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const renderNavbar = (isAuthenticated, logout = jest.fn()) => {
  render(
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar Component', () => {
  it('renders Login and Signup links when not authenticated', () => {
    renderNavbar(false);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });
  
  it('renders Favorites and Logout when authenticated', () => {
    renderNavbar(true);
    expect(screen.getByText(/favorites/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });
  
  it('calls logout when Logout is clicked', () => {
    const logoutMock = jest.fn();
    renderNavbar(true, logoutMock);
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalled();
  });
});
