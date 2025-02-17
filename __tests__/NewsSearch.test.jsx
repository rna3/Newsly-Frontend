import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsSearch from '../src/components/NewsSearch';
import { BrowserRouter } from 'react-router-dom';
import api from '../src/api';

jest.mock('../src/api');

describe('NewsSearch Component', () => {
  beforeEach(() => {
    api.get.mockClear();
  });
  
  it('renders search form', () => {
    render(
      <BrowserRouter>
        <NewsSearch />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/search news/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
  
  it('displays articles on successful search', async () => {
    const fakeArticles = [
      { title: 'Article 1', url: 'https://example.com/1', description: 'Desc 1', urlToImage: 'https://example.com/img1.jpg' },
      { title: 'Article 2', url: 'https://example.com/2', description: 'Desc 2', urlToImage: 'https://example.com/img2.jpg' },
    ];
    api.get.mockResolvedValueOnce({ data: { articles: fakeArticles } });
    render(
      <BrowserRouter>
        <NewsSearch />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/search news/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(`/news/search?q=test`);
    });
    // Check if articles are rendered:
    expect(screen.getByText(/article 1/i)).toBeInTheDocument();
    expect(screen.getByText(/article 2/i)).toBeInTheDocument();
  });
});
