import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D84315", // Contact button red
    },
    secondary: {
      main: "#FFC107", // Air quality yellow
    },
    warning: {
      main: "#FFB300", // Wildfire risk yellow
    },
    error: {
      main: "#B71C1C", // Alert red
    },
    background: {
      default: "linear-gradient(135deg, #3D0B0B 0%, #7A1D1D 100%)",
      paper: "rgba(255,255,255,0.08)",
    },
    text: {
      primary: "#FFFFFF", // white text
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #3D0B0B 0%, #7A1D1D 100%)",
          minHeight: "100vh",
          color: "#FFFFFF",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.08)",
          color: "#fff",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
