import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyLogin from "./components/login/login";
import Customers from "./components/customers/customers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyLogin />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </Router>
  );
}

export default App;
