// src/components/RoscoResultsList.tsx
import { Box, Divider, Typography } from "@mui/material";
import { AIWord } from "../models/AIWord";

interface RoscoResultsListProps {
  words: AIWord[];
  statuses: ("unanswered" | "correct" | "mistake" | "skip")[];
}

export function RoscoResultsList({ words, statuses }: RoscoResultsListProps) {
  return (
    <Box
      sx={{
        maxHeight: "400px",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: 2,
        padding: 2,
        boxShadow: 3,
        width: "100%",
      }}
    >
      {words.map((word, index) => {
        let color = "#000";
        if (statuses[index] === "correct") color = "#28a745"; // verde
        else if (statuses[index] === "mistake") color = "#dc3545"; // rojo
        else color = "#6c757d"; // gris neutro

        return (
          <Box sx={{ marginBottom: 2 }}>
            <Typography
              key={word.letter}
              sx={{ color, fontSize: 18 }}
              className="pixel-font"
            >
              {word.letter}: {word.word}
            </Typography>
            <Typography
              key={index}
              className="pixel-font"
              sx={{ fontSize: 14, mb: 2 }}
              color="#000"
            >
              {word.description}
            </Typography>
            <Divider />
          </Box>
        );
      })}
    </Box>
  );
}
