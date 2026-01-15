import React, { useState } from "react";
import { toast } from "react-toastify";

const parseMealsFromText = (text) => {
  // Simple format: mỗi dòng: "Time|dish1:cal,dish2:cal"
  // Ví dụ: "Sáng|Cháo yến mạch:300,Trứng luộc:80"
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const [time, rest] = line.split("|");
      const dishes = (rest || "")
        .split(",")
        .map((it) => it.trim())
        .filter(Boolean)
        .map((d) => {
          const [name, calStr] = d.split(":");
          const calories = Number(calStr) || 0;
          return { name: (name || "").trim(), calories };
        });
      return { id: `meal_${idx}_${Date.now()}`, time: (time || "").trim(), dishes };
    });
};

const MealForm = ({ onCreate, initial = null, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [duration, setDuration] = useState(initial?.duration || "7 ngày");
  const [mealsText, setMealsText] = useState(
    initial
      ? initial.meals
          .map((m) => `${m.time}|${m.dishes.map((d) => `${d.name}:${d.calories}`).join(",")}`)
          .join("\n")
      : "Sáng|Cháo yến mạch:300,Trứng luộc:80\nTrưa|Cơm gạo lứt:350,Ức gà nướng:220"
  );

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Tiêu đề không được để trống");

    const meals = parseMealsFromText(mealsText);
    if (!meals.length) return toast.error("Vui lòng nhập ít nhất một bữa");

    const newPlan = {
      id: (initial?.id || Date.now().toString()),
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim(),
      meals,
    };

    onCreate(newPlan);
    toast.success(initial ? "Cập nhật kế hoạch thành công" : "Thêm kế hoạch thành công");
    // reset only when creating
    if (!initial) {
      setTitle("");
      setDescription("");
      setDuration("7 ngày");
      setMealsText("Sáng|Cháo yến mạch:300,Trứng luộc:80\nTrưa|Cơm gạo lứt:350,Ức gà nướng:220");
    }
    onCancel && onCancel();
  };

  return (
    <form onSubmit={submit} className="mb-4">
      <div className="row g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Thời lượng" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div className="col-md-2 d-flex align-items-center">
          <button type="submit" className="btn btn-success me-2">Lưu</button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Hủy</button>
        </div>
      </div>

      <div className="mt-3">
        <label className="form-label">Bữa ăn (mỗi dòng: Time|dish:cal,dish:cal)</label>
        <textarea className="form-control" rows={5} value={mealsText} onChange={(e) => setMealsText(e.target.value)} />
        <small className="text-muted">Ví dụ: Sáng|Cháo yến mạch:300,Trứng luộc:80</small>
      </div>
    </form>
  );
};

export default MealForm;
