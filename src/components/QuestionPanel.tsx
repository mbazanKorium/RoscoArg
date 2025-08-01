// src/components/QuestionPanel.tsx
import React from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { ScoreBoard } from "./ScoreBoard";

interface QuestionPanelProps {
  definition: string;
  userAnswer: string;
  correctCount: number;
  wrongCount: number;
  timeLeft?: number;
  setUserAnswer: (value: string) => void;
  onAnswerSubmit: () => void;
  onSkip: () => void;
}

export function QuestionPanel({
  definition,
  userAnswer,
  correctCount,
  wrongCount,
  timeLeft,
  setUserAnswer,
  onAnswerSubmit,
  onSkip,
}: QuestionPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswerSubmit();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ textAlign: "center", py: 4, mt: 5, minWidth: "300px" }}
    >
      <Typography variant="h5" gutterBottom className="pixel-font">
        ¿Qué palabra es?
      </Typography>
      <Typography
        variant="subtitle1"
        className="pixel-font"
        gutterBottom
        sx={{ color: "#4b5563" }}
      >
        Pista: {definition}
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={2}
        gap={2}
      >
        <TextField
          className="pixel-font"
          label="Ingresa tu respuesta"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <Button
          variant="contained"
          className="pixel-font"
          color="warning"
          onClick={onSkip}
          sx={{ height: "56px" }}
        >
          Pasapalabra
        </Button>
      </Box>
      <ScoreBoard
        correctCount={correctCount}
        wrongCount={wrongCount}
        timeLeft={timeLeft}
      />
    </Paper>
  );
}
