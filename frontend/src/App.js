import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyLogin from "./components/login/login.tsx";
import Customers from "./components/customers/customers.tsx";
import CustomerSales from "./components/customers/customersSales.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyLogin />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:customerId" element={<CustomerSales />} />
      </Routes>
    </Router>
  );
}

export default App;
