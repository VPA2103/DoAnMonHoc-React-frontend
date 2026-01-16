import React, { useState } from 'react';

const RecipeDetail = ({ recipe }) => {
  const [comments, setComments] = useState(recipe.comments || []);
  const [newComment, setNewComment] = useState({ user: '', text: '' });
  const [userRating, setUserRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(recipe.rating);

  if (!recipe) {
    return <div>Công thức không tồn tại.</div>;
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.user && newComment.text) {
      const comment = {
        id: comments.length + 1,
        user: newComment.user,
        text: newComment.text,
        date: new Date().toISOString().split('T')[0]
      };
      setComments([...comments, comment]);
      setNewComment({ user: '', text: '' });
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (userRating > 0) {
      // Tính trung bình rating mới (giả sử có 1 vote trước)
      const newRating = ((currentRating * 1) + userRating) / 2;
      setCurrentRating(newRating);
      setUserRating(0);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <img src={recipe.image} alt={recipe.name} style={{ width: '100%', maxWidth: '600px', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
      <h1>{recipe.name}</h1>
      <p><strong>Calo:</strong> {recipe.calories} kcal</p>
      <p><strong>Đánh giá:</strong> {'★'.repeat(Math.floor(currentRating))} ({currentRating.toFixed(1)})</p>
      <p>{recipe.description}</p>

      {/* Phần đánh giá */}
      <div style={{ marginTop: '20px' }}>
        <h3>Đánh giá công thức</h3>
        <form onSubmit={handleRatingSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Chọn số sao:</label>
            <select value={userRating} onChange={(e) => setUserRating(Number(e.target.value))} style={{ marginLeft: '10px' }}>
              <option value={0}>-- Chọn --</option>
              <option value={1}>1 ★</option>
              <option value={2}>2 ★★</option>
              <option value={3}>3 ★★★</option>
              <option value={4}>4 ★★★★</option>
              <option value={5}>5 ★★★★★</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '5px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Gửi đánh giá</button>
        </form>
      </div>

      {/* Phần bình luận */}
      <div style={{ marginTop: '30px' }}>
        <h3>Bình luận</h3>
        {comments.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map(comment => (
              <li key={comment.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                <strong>{comment.user}</strong> ({comment.date}): {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>Chưa có bình luận nào.</p>
        )}

        {/* Form thêm bình luận */}
        <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Tên của bạn"
              value={newComment.user}
              onChange={(e) => setNewComment({ ...newComment, user: e.target.value })}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              placeholder="Viết bình luận của bạn..."
              value={newComment.text}
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              style={{ width: '100%', padding: '8px', height: '80px' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Gửi bình luận</button>
        </form>
      </div>
    </div>
  );
};

export default RecipeDetail;