import { Typography } from "@mui/material";

interface TimerProps {
  timeLeft: number; // en segundos
}

export function Timer({ timeLeft }: TimerProps) {
  // Formateamos en mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Typography variant="body1" sx={{ color: "#000" }}>
      Tiempo: {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </Typography>
  );
}
