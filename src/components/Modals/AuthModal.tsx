// src/components/AuthModal.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

interface AuthModalProps {
  open: boolean;
  authModeInfo: "login" | "signup";
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  authModeInfo,
  onClose,
  onLogin,
  onSignUp,
}) => {
  // Estado para definir el modo actual: "login" o "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (authModeInfo) {
      setAuthMode(authModeInfo);
    }
  }, [authModeInfo]);

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para signup
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  // Función para cambiar entre modos
  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  // Funciones para manejar cada acción
  const handleLogin = () => {
    onLogin(loginEmail, loginPassword);
    setLoginEmail("");
    setLoginPassword("");
    onClose();
  };

  const handleSignUp = () => {
    if (signUpPassword !== signUpConfirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    onSignUp(signUpName, signUpEmail, signUpPassword);
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpConfirmPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ p: 5 }}>
      <DialogTitle>{authMode === "login" ? "Login" : "Registro"}</DialogTitle>
      <DialogContent>
        {authMode === "login" ? (
          <>
            <TextField
              autoFocus
              margin="normal"
              label="Email"
              type="email"
              fullWidth
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Contraseña"
              type="password"
              fullWidth
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </>
        ) : (
          <>
            <TextField
              autoFocus
              margin="normal"
              label="Nombre"
              fullWidth
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Email"
              type="email"
              fullWidth
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Contraseña"
              type="password"
              fullWidth
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Confirmar Contraseña"
              type="password"
              fullWidth
              value={signUpConfirmPassword}
              onChange={(e) => setSignUpConfirmPassword(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1, pl: 2 }}>
          <Typography variant="body2">
            {authMode === "login"
              ? "¿No tienes cuenta? "
              : "¿Ya tienes cuenta? "}
            <Button
              onClick={toggleAuthMode}
              sx={{ textTransform: "none", p: 0, minWidth: 0 }}
            >
              {authMode === "login" ? "Registrate" : "Inicia Sesión"}
            </Button>
          </Typography>
        </Box>
        <Button onClick={onClose}>Cancelar</Button>
        {authMode === "login" ? (
          <Button onClick={handleLogin} variant="contained">
            Ingresar
          </Button>
        ) : (
          <Button onClick={handleSignUp} variant="contained">
            Registrarse
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
