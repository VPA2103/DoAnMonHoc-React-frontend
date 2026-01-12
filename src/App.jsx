import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default App;
