import React, { createContext, useContext, useState } from "react";
import { MOCK_MEAL_PLANS } from "../utils/mockMealPlans";

const MealPlanContext = createContext(null);

export const MealPlanProvider = ({ children }) => {
  const [plans, setPlans] = useState(MOCK_MEAL_PLANS);

  const addPlan = (plan) => {
    const newPlan = { ...plan, id: plan.id || Date.now().toString() };
    setPlans((p) => [newPlan, ...p]);
    return newPlan;
  };

  const updatePlan = (plan) => {
    setPlans((p) => p.map((it) => (it.id === plan.id ? plan : it)));
  };

  const deletePlan = (id) => {
    setPlans((p) => p.filter((it) => it.id !== id));
  };

  const getPlanById = (id) => plans.find((p) => p.id === id);

  return (
    <MealPlanContext.Provider value={{ plans, addPlan, updatePlan, deletePlan, getPlanById }}>
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlans = () => {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error("useMealPlans must be used inside MealPlanProvider");
  return ctx;
};
