import React from "react";
import { useParams, Link } from "react-router-dom";
import RecipeDetail from "../../components/Recipes/RecipeDetail";
import { MOCK_RECIPES } from "../../utils/mockRecipes";

const RecipeDetailPage = () => {
  const { id } = useParams();

  const recipe = MOCK_RECIPES.find(r => r.id === parseInt(id));

  return (
    <div className="container my-4">
      <Link to="/recipes" className="btn btn-link">&larr; Quay lại</Link>
      <RecipeDetail recipe={recipe} />
    </div>
  );
};

export default RecipeDetailPage;