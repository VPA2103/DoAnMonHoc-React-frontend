import React, { useState } from "react";
import MealPlanList from "../../components/MealPlan/MealPlanList";
import MealForm from "../../components/MealPlan/MealForm";
import { useMealPlans } from "../../context/MealPlanContext";
import "./MealPlans.css";

const MealPlans = () => {
  const { plans, addPlan, updatePlan, deletePlan } = useMealPlans();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleCreate = (newPlan) => {
    addPlan(newPlan);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xóa kế hoạch này?")) return;
    deletePlan(id);
  };

  const handleEdit = (plan) => {
    setEditing(plan);
    setShowForm(true);
  };

  const handleUpdate = (updated) => {
    updatePlan(updated);
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Kế hoạch bữa ăn</h2>
          <p className="text-muted mb-0">Chọn một kế hoạch để xem chi tiết các bữa ăn trong tuần.</p>
        </div>
        <div>
          <button className="btn btn-primary me-2" onClick={() => { setShowForm((s) => !s); setEditing(null); }}>
            {showForm ? "Đóng" : "Thêm kế hoạch"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <MealForm onCreate={editing ? handleUpdate : handleCreate} initial={editing} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      <MealPlanList plans={plans} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};

export default MealPlans;
