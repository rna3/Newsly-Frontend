import { useState, useEffect } from 'react';
import api from '../api';

const useComments = (articleId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch comments for the given article
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/comments?article_id=${encodeURIComponent(articleId)}`);
      setComments(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to post a new comment
  const postComment = async (commentText) => {
    try {
      const res = await api.post('/comments', { article_id: articleId, comment: commentText });
      // Prepend the new comment to the existing list
      setComments((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Function to update an existing comment
  const updateComment = async (commentId, commentText) => {
    try {
      const res = await api.patch(`/comments/${commentId}`, { comment: commentText });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? res.data : c))
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Function to delete a comment
  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      throw err;
    }
  };

  // Automatically fetch comments when articleId changes.
  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  return {
    comments,
    loading,
    error,
    fetchComments,
    postComment,
    updateComment,
    deleteComment,
  };
};

export default useComments;
