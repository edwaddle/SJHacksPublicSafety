import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Camera from "./pages/Camera";
import Chat from "./pages/Chat";
import "./index.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
