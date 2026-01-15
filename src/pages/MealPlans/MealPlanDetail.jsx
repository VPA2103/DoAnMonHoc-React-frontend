import React from "react";
import { useParams, Link } from "react-router-dom";
import { useMealPlans } from "../../context/MealPlanContext";
import MealPlanDetail from "../../components/MealPlan/MealPlanDetail";

const MealPlanPage = () => {
  const { id } = useParams();
  const { getPlanById } = useMealPlans();
  const plan = getPlanById(id);

  return (
    <div className="container my-4">
      <Link to="/meal-plans" className="btn btn-link">&larr; Quay lại</Link>
      <MealPlanDetail plan={plan} />
    </div>
  );
};

export default MealPlanPage;
