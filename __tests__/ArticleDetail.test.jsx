import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleDetail from '../src/components/ArticleDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthContext';
import useComments from '../src/hooks/useComments';

jest.mock('../src/hooks/useComments');

const fakeAuthContextValue = {
  user: { id: 1, email: 'test@example.com' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  fetchUser: jest.fn(),
};

describe('ArticleDetail Component', () => {
  const fakeArticle = {
    title: 'Test Article',
    url: 'https://example.com/test',
    urlToImage: 'https://example.com/img.jpg',
    content: 'Test content',
    description: 'Test description',
    source: { name: 'Test Source' },
    publishedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Mock the custom hook to return no comments and not loading.
    useComments.mockReturnValue({
      comments: [],
      loading: false,
      error: null,
      postComment: jest.fn().mockResolvedValue(),
      updateComment: jest.fn().mockResolvedValue(),
      deleteComment: jest.fn().mockResolvedValue(),
    });
  });

  it('renders article details', () => {
    render(
      <AuthContext.Provider value={fakeAuthContextValue}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: `/article/${encodeURIComponent(fakeArticle.url)}`,
              state: { article: fakeArticle },
            },
          ]}
        >
          <Routes>
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </MemoryRouter>
        </AuthContext.Provider>
    );
    // Now it should find the text from fakeArticle.
    expect(screen.getByText(/Test Article/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Test content/i) || screen.getByText(/Test description/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Read more at Test Source/i)).toBeInTheDocument();
  });
});
