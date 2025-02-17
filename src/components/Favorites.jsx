// src/components/Favorites.jsx
import React, { useState } from 'react';
import useFavorites from '../hooks/useFavorites';
import FavoriteItem from './FavoriteItem';
import styles from './styles/Favorites.module.css';

const Favorites = () => {
  const { favorites, loading, error, deleteFavorites } = useFavorites();
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  

  // Toggle checkbox selection for a favorite.
  const handleCheckboxChange = (favoriteId) => {
    setSelectedFavorites((prevSelected) =>
      prevSelected.includes(favoriteId)
        ? prevSelected.filter((id) => id !== favoriteId)
        : [...prevSelected, favoriteId]
    );
  };

  // Delete selected favorites.
  const handleDeleteSelected = async () => {
    try {
      await deleteFavorites(selectedFavorites);
      setSelectedFavorites([]);
    } catch (err) {
      console.error('Error deleting favorites:', err);
      alert('Error deleting favorites');
    }
  };

  // error indicating loading issues
  if (loading) return <p className={styles.status}>Loading favorites...</p>;
  if (error) return <p className={`${styles.status} ${styles.error}`}>Error loading favorites.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favorites</h2>
      {selectedFavorites.length > 0 && (
        <button className={styles.deleteBtn} onClick={handleDeleteSelected}>
          Delete Selected
        </button>
      )}
      {favorites.length === 0 ? (
        <p className={styles.status}>No favorites yet.</p>
      ) : (
        <div className={styles.grid}>
          {favorites.map((fav) => (
            <FavoriteItem
              key={fav.id}
              favorite={fav}
              isSelected={selectedFavorites.includes(fav.id)}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
