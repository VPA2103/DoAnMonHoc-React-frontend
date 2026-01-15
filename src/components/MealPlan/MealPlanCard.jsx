import React from "react";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/paths";

const MealPlanCard = ({ plan, onEdit, onDelete }) => {
  const totalCalories = plan.meals.reduce((sum, m) => sum + m.dishes.reduce((s, d) => s + d.calories, 0), 0);

  return (
    <div className="card mb-3 shadow-sm mealplan-card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="card-title">{plan.title}</h5>
            <p className="card-text text-muted">{plan.description}</p>
          </div>
          <div className="text-end">
            <small className="text-secondary d-block">{plan.duration}</small>
            <small className="text-secondary d-block">Tổng calo: {totalCalories} kcal</small>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div>
            <Link to={`${PATH.MEAL_PLANS}/${plan.id}`} className="btn btn-primary btn-sm me-2">
              Xem chi tiết
            </Link>
            {onEdit && (
              <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => onEdit(plan)}>Sửa</button>
            )}
          </div>
          {onDelete && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(plan.id)}>Xóa</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;
