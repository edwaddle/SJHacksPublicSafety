import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import UploadFile from "./pages/UploadFile";
import "./index.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/upload" element={<UploadFile />} />
      </Routes>
    </Router>
  );
}

export default App;
