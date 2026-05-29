import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaticRedirect from "./pages/StaticRedirect";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public-facing pages: always redirect to the static HTML build */}
          <Route path="/" element={<StaticRedirect to="/visifinder-final.html" />} />
          <Route path="/thank-you" element={<StaticRedirect to="/visifinder-thank-you.html" />} />
          <Route path="/contact" element={<StaticRedirect to="/visifinder-contact.html" />} />

          {/* Keep React-only routes available if needed */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Catch-all → static landing */}
          <Route path="*" element={<StaticRedirect to="/visifinder-final.html" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
