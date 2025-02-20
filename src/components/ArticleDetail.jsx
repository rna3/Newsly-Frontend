import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api';
import useComments from '../hooks/useComments';
import { AuthContext } from '../context/AuthContext';
import styles from './styles/ArticleDetail.module.css';

const ArticleDetail = () => {
  // Get the article URL from the route parameter and decode it.
  const { id } = useParams();
  const decodedUrl = decodeURIComponent(id);
  const article = useLocation().state?.article || { url: decodedUrl };
  const uniqueArticleId = article.url || decodedUrl;

  // Manage comments using the custom hook.
  const { comments, loading, error, postComment, updateComment, deleteComment } = useComments(uniqueArticleId);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  // State for favorite status.
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState('');

  // Get current user from AuthContext.
  const { user } = useContext(AuthContext);

  // Check if the article is already favorited.
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const res = await api.get('/favorites');
        const alreadyFavorited = res.data.some(
          (fav) => fav.article_id === uniqueArticleId
        );
        if (alreadyFavorited) {
          setIsFavorited(true);
          setFavoriteStatus('Article is in your favorites');
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    checkFavoriteStatus();
  }, [uniqueArticleId]);

  // Handler for favoriting the article.
  const handleFavorite = async () => {
    try {
      await api.post('/favorites', {
        article_id: uniqueArticleId,
        title: article.title,
        url: article.url,
        image_url: article.urlToImage || article.image_url,
        published_at: article.publishedAt,
        source_name: article.source?.name,
        content: article.content || article.description || '',
      });
      setIsFavorited(true);
      setFavoriteStatus('Article is in your favorites');
    } catch (error) {
      console.error('Error favoriting article:', error);
      setFavoriteStatus('Failed to favorite article');
    }
  };

  // Handler for submitting a new comment.
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await postComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment');
    }
  };

  // Handler to begin editing a comment.
  const handleEdit = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentText);
  };

  // Handler for saving an edited comment.
  const handleSaveEdit = async (commentId) => {
    try {
      await updateComment(commentId, editedCommentText);
      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Error updating comment');
    }
  };

  // Handler for deleting a comment.
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  };

  return (
    <div className={styles.articleDetailContainer}>
      <h2 className={styles.title}>{article.title || 'Article Detail'}</h2>
      {(article.urlToImage || article.image_url) && (
        <img
          src={article.urlToImage || article.image_url}
          alt={article.title}
          className={styles.image}
        />
      )}
      <p className={styles.content}>
        {article.content || article.description || 'Full article content not available.'}
      </p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sourceLink}
      >
        Read more at {article.source?.name || 'source'}
      </a>
      
      {/* Favorite Section */}
      <div className={styles.favoriteSection}>
        {!isFavorited ? (
          <button className={styles.favoriteBtn} onClick={handleFavorite}>
            Favorite
          </button>
        ) : (
          <p className={styles.favoriteStatus}>{favoriteStatus}</p>
        )}
      </div>

      {/* Comments Section */}
      <section className={styles.commentsSection}>
        <h3 className={styles.commentsTitle}>Comments</h3>
        <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
          <textarea
            className={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows="4"
          />
          <button type="submit" className={styles.commentSubmit}>
            Post Comment
          </button>
        </form>
        {loading && <p>Loading comments...</p>}
        {error && <p className={styles.error}>Error loading comments.</p>}
        <div className={styles.commentsList}>
          {comments.length === 0 && !loading ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <p className={styles.commentAuthor}>
                  <strong>{comment.username}</strong> said:
                </p>
                {editingCommentId === comment.id ? (
                  <div className={styles.editSection}>
                    <textarea
                      className={styles.editInput}
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                      rows="3"
                    />
                    <button onClick={() => handleSaveEdit(comment.id)} className={styles.saveBtn}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditedCommentText('');
                      }}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className={styles.commentText}>{comment.comment}</p>
                )}
                <p className={styles.commentTimestamp}>
                  {new Date(comment.created_at).toLocaleString()}
                </p>
                {user && comment.user_id === user.id && editingCommentId !== comment.id && (
                  <div className={styles.commentActions}>
                    <button
                      onClick={() => handleEdit(comment.id, comment.comment)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
