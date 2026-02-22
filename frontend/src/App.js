import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VSLPage from "./pages/VSLPage";
import SchedulePage from "./pages/SchedulePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VSLPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
