import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/FavoriteItem.module.css';

const FavoriteItem = ({ favorite, isSelected, onCheckboxChange }) => {
  return (
    <div className={styles.card}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckboxChange(favorite.id)}
          className={styles.checkbox}
        />
      </div>
      <h3 className={styles.title}>
        <Link to={`/article/${encodeURIComponent(favorite.article_id)}`} state={{ article: favorite }}>
          {favorite.title}
        </Link>
      </h3>
      {favorite.image_url && (
        <img src={favorite.image_url} alt={favorite.title} className={styles.image} />
      )}
      <p className={styles.published}>Published: {new Date(favorite.published_at).toLocaleString()}</p>
      <a href={favorite.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
        Read more at {favorite.source_name || 'source'}
      </a>
    </div>
  );
};

export default FavoriteItem;
