import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserRoutes from "./routes/UserRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/*" element={<UserRoutes />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
