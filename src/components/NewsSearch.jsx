import React, { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import styles from './styles/NewsSearch.module.css';

const NewsSearch = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Call the backend news search endpoint
      const res = await api.get(`/news/search?q=${query}`);
      setArticles(res.data.articles);
    } catch (err) {
      setError('Error searching news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.newsSearchContainer}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input 
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>
      {loading && <p>Loading news...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.results}>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className={styles.articleCard}>
              <h3>{article.title}</h3>
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className={styles.articleImage}
                />
              )}
              <p>{article.description}</p>
              <Link
                to={`/article/${encodeURIComponent(article.url)}`}
                state={{ article }}
                className={styles.detailLink}
              >
                Read Full Article
              </Link>
            </div>
          ))
        ) : (
          !loading && <p>Your search results will be displayed here!</p>
        )}
      </div>
    </div>
  );
};

export default NewsSearch;
