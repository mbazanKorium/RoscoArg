// src/components/RoscoWheel.tsx
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface RoscoWheelProps {
  letters: string[];
  statuses: ("unanswered" | "correct" | "mistake" | "skip")[];
  currentIndex: number;
}

export function RoscoWheel({
  letters,
  statuses,
  currentIndex,
}: RoscoWheelProps) {
  const theme = useTheme();
  const circleRadius = 150;
  const angleStep = (2 * Math.PI) / letters.length;

  return (
    <Paper
      elevation={3}
      sx={{
        width: circleRadius * 2 + 40, // Añadimos un poco de espacio adicional
        height: circleRadius * 2 + 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        p: 2,
        borderRadius: "50%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: circleRadius * 2,
          height: circleRadius * 2,
          margin: "auto",
        }}
      >
        {letters.map((letter, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const x = circleRadius + circleRadius * Math.cos(angle);
          const y = circleRadius + circleRadius * Math.sin(angle);

          // Determinar el color según el estado:
          let bgColor = "grey.300";
          const status = statuses[idx];
          if (idx === currentIndex) {
            bgColor = theme.palette.main.letter;
          } else if (status === "correct") {
            bgColor = theme.palette.main.letterSuccess;
          } else if (status === "mistake") {
            bgColor = theme.palette.main.letterMistake;
          } else if (status === "skip") {
            bgColor = theme.palette.main.letterSkip;
          } else {
            // Si está sin responder
            bgColor = "grey.300";
          }

          let borderColor = "grey.300";
          if (idx === currentIndex) {
            borderColor = "#73b9fc";
          } else if (status === "correct") {
            borderColor = "#3cff81";
          } else if (status === "mistake") {
            borderColor = "#ff2100";
          } else if (status === "skip") {
            borderColor = "#fffe26";
          } else {
            borderColor = "grey.300";
          }
          return (
            <Box
              key={letter}
              sx={{
                position: "absolute",
                top: y,
                left: x,
                transform: "translate(-50%, -50%)",
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${borderColor}`,
              }}
            >
              <Typography
                variant="body2"
                color={
                  status !== "unanswered" || idx === currentIndex
                    ? "#fff"
                    : "#000"
                }
              >
                {letter}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
