import React from 'react';

const RecipeDetail = ({ recipe }) => {
  if (!recipe) {
    return <div>Công thức không tồn tại.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <img src={recipe.image} alt={recipe.name} style={{ width: '100%', maxWidth: '600px', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
      <h1>{recipe.name}</h1>
      <p><strong>Calo:</strong> {recipe.calories} kcal</p>
      <p><strong>Đánh giá:</strong> {'★'.repeat(Math.floor(recipe.rating))} ({recipe.rating})</p>
      <p>{recipe.description}</p>
      {/* Có thể thêm nguyên liệu, hướng dẫn nấu ở đây */}
    </div>
  );
};

export default RecipeDetail;