import React from "react";
import MealPlanCard from "./MealPlanCard";

const MealPlanList = ({ plans, onDelete, onEdit }) => {
  if (!plans || plans.length === 0) return <p>Không có kế hoạch bữa ăn.</p>;

  return (
    <div className="row">
      <div className="col-12">
        {plans.map((plan) => (
          <MealPlanCard key={plan.id} plan={plan} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default MealPlanList;
