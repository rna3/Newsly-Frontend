import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/components/Login';
import { AuthContext } from '../src/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import api from '../src/api';

// Mock the API module
jest.mock('../src/api');

const renderLogin = (login = jest.fn()) => {
  render(
    <AuthContext.Provider value={{ isAuthenticated: false, login }}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    api.post.mockClear();
  });
  
  it('renders the login form with email and password fields and a login button', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('calls the API and context login on successful submission', async () => {
    const fakeToken = 'fake-jwt-token';
    api.post.mockResolvedValueOnce({ data: { token: fakeToken } });
    const loginMock = jest.fn();
    renderLogin(loginMock);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'password' });
      expect(loginMock).toHaveBeenCalledWith(fakeToken);
    });
  });
});
