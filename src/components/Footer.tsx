import { AppBar, Typography } from "@mui/material";

export function Footer() {
  return (
    <AppBar
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        position: "fixed",
        mt: 4,
        py: 2,
        backgroundColor: "#1f2937",
        textAlign: "center",
        top: "auto",
        bottom: 0,
      }}
    >
      <Typography variant="body2">
        © 2025 Rosco - Juego de Palabras del Lunfardo. Todos los derechos
        reservados.
      </Typography>
    </AppBar>
  );
}
