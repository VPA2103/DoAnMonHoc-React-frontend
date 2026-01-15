import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_RECIPES } from '../../utils/mockRecipes';

const Recipes = () => {
  const recipes = MOCK_RECIPES;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh Sách Công Thức</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {recipes.map((recipe) => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', cursor: 'pointer' }}>
              <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
              <h3>{recipe.name}</h3>
              <p><strong>Calo:</strong> {recipe.calories} kcal</p>
              <p>Đánh giá: {'★'.repeat(Math.floor(recipe.rating))} ({recipe.rating})</p>
              <p>{recipe.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recipes;