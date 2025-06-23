// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";

import "./App.css";
import TermoNeitor from "./pages/TermoNeitor";
import { Box } from "@mui/material";

function App() {
  // const [openAuthModal, setOpenAuthModal] = useState(false);
  // const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // const handleAuthOpen = (mode: "login" | "signup") => {
  //   setAuthMode(mode);
  //   setOpenAuthModal(true);
  // };

  // const handleAuthClose = () => setOpenAuthModal(false);

  // const handleLogin = (email: string, password: string) => {
  //   console.log("Login con:", email, password);
  // };

  // const handleSignUp = (name: string, email: string, password: string) => {
  //   console.log("Registro con:", name, email, password);
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/rosco"
          element={<Game onBack={() => (window.location.href = "/")} />}
        />
        {/* Futuras rutas */}
        <Route
          path="/termo-neitor"
          element={
            <Box className="pixel-font">
              <TermoNeitor onBack={() => (window.location.href = "/")} />
            </Box>
          }
        />
        <Route path="/conurbano" element={<div>Próximamente: Conurbano</div>} />
      </Routes>
      {/* <AuthModal
        authModeInfo={authMode}
        open={openAuthModal}
        onClose={handleAuthClose}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      /> */}
    </Router>
  );
}

export default App;
