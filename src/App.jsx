import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { MealPlanProvider } from "./context/MealPlanContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <MealPlanProvider>
        <AppRoutes />
      </MealPlanProvider>
      <ToastContainer />
    </>
  );
}

export default App;
