import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VSLPage from "./pages/VSLPage";
import SchedulePage from "./pages/SchedulePage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VSLPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
