import { useState, useEffect } from 'react';
import api from '../api';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch favorites from the backend.
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete multiple favorites given their IDs.
  const deleteFavorites = async (ids) => {
    try {
      await api.delete('/favorites', { data: { ids } });
      setFavorites((prev) => prev.filter((fav) => !ids.includes(fav.id)));
    } catch (err) {
      throw err;
    }
  };

  // Fetch favorites when the hook first runs.
  useEffect(() => {
    fetchFavorites();
  }, []);

  return { favorites, loading, error, fetchFavorites, deleteFavorites };
};

export default useFavorites;
