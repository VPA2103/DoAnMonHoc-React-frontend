import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserRoutes from "./routes/UserRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Home/HomePage";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";

function App() {
  return (
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
