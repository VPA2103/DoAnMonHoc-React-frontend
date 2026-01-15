import React from "react";

const MealPlanDetail = ({ plan }) => {
  if (!plan) return <p>Không tìm thấy kế hoạch.</p>;

  const totalCalories = plan.meals.reduce((sum, m) => sum + m.dishes.reduce((s, d) => s + d.calories, 0), 0);

  return (
    <div className="card shadow-sm mealplan-detail">
      <div className="card-body">
        <h3 className="card-title">{plan.title} <small className="text-secondary">({plan.meals.length} bữa/ngày)</small></h3>
        <p className="text-muted">{plan.description}</p>
        <p><strong>Thời lượng:</strong> {plan.duration}</p>
        <p><strong>Tổng calo dự tính:</strong> {totalCalories} kcal</p>
        <hr />

        <div className="row">
          {plan.meals.map((meal) => (
            <div key={meal.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{meal.time}</h6>
                  <ul className="list-unstyled mb-0">
                    {meal.dishes.map((d, i) => (
                      <li key={i} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                        <span>{d.name}</span>
                        <small className="text-secondary">{d.calories} kcal</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanDetail;
