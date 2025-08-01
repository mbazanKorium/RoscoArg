import { Box, Typography } from "@mui/material";
import { Timer } from "./Timer";

interface ScoreBoardProps {
  correctCount: number;
  wrongCount: number;
  timeLeft?: number;
}

export function ScoreBoard({
  correctCount,
  wrongCount,
  timeLeft,
}: ScoreBoardProps) {
  return (
    <Box
      textAlign="center"
      sx={{ display: "flex", justifyContent: "space-evenly" }}
      mt={4}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Typography
          variant="body1"
          className="pixel-font"
          sx={{ color: "#000" }}
        >
          Correctas:
        </Typography>
        <Typography
          variant="body1"
          className="pixel-font"
          sx={{ color: "green", fontWeight: "bold" }}
        >
          {correctCount}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Typography
          variant="body1"
          className="pixel-font"
          sx={{ color: "#000" }}
        >
          Incorrectas:
        </Typography>
        <Typography
          variant="body1"
          className="pixel-font"
          sx={{ color: "red", fontWeight: "bold" }}
        >
          {wrongCount}
        </Typography>
      </Box>
      {timeLeft && <Timer timeLeft={timeLeft} />}
    </Box>
  );
}
