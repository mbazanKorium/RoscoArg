import { useEffect, useState } from "react";
import "./App.css";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useLunfardoWords } from "./hooks/useLunfardoWords";

// Importaciones de Material UI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
} from "@mui/material";
import AuthModal from "./components/Modals/AuthModal";
import Game from "./pages/Game";
import { RoscoWheel } from "./components/RoscoWheel";
import { Footer } from "./components/Footer";

const MockLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function App() {
  // Usamos el hook que trae la data de la API
  const { words, error } = useLunfardoWords();
  const [showGame, setShowGame] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (words && words.data) {
      console.log("Words: ", words);
    }
  }, [words]);

  const handleFetchWords = async () => {
    setShowGame(true);
  };

  if (showGame) {
    return <Game onBack={() => setShowGame(false)} />;
  }

  const handleAuthOpen = (newValue: "login" | "signup") => {
    setAuthMode(newValue);
    setOpenAuthModal(true);
  };
  const handleAuthClose = () => setOpenAuthModal(false);

  const handleLogin = (email: string, password: string) => {
    console.log("Login con:", email, password);
    // Lógica de autenticación aquí
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    console.log("Registro con:", name, email, password);
    // Lógica de registro aquí
  };

  // En caso de error
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              color: (theme) => theme.palette.main.button,
              fontWeight: "600",
            }}
          >
            Rosco
          </Typography>
          <Button
            startIcon={<PersonOutlinedIcon />}
            sx={{
              textTransform: "capitalize",
              color: "#111827",
              marginRight: 2,
            }}
            onClick={() => {
              handleAuthOpen("login");
            }}
          >
            Login
          </Button>
          <Button
            sx={{
              textTransform: "capitalize",
              backgroundColor: (theme) => theme.palette.main.button,
              color: "#fff",
            }}
            onClick={() => {
              handleAuthOpen("signup");
            }}
          >
            Registrarse
          </Button>
        </Toolbar>
      </AppBar>

      {/** Contenedor principal **/}
      <Container
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <RoscoWheel
          letters={MockLetters}
          currentIndex={7}
          statuses={[
            "correct",
            "correct",
            "mistake",
            "skip",
            "correct",
            "correct",
            "skip",
          ]}
        />
        <Grid container spacing={4}>
          <Grid size={12} textAlign="center">
            <Typography
              variant="h4"
              sx={{ color: "black", fontWeight: "bold" }}
            >
              Bienvenido al Rosco de Lunfardo
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "black" }}>
              Presiona el botón para generar palabras y sus definiciones
            </Typography>
          </Grid>
          <Grid size={12} textAlign="center">
            <Button variant="contained" onClick={handleFetchWords}>
              Generar Rosco
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <AuthModal
        authModeInfo={authMode}
        open={openAuthModal}
        onClose={handleAuthClose}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    </>
  );
}

export default App;
