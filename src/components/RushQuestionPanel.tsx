import React, { useEffect, useState } from "react";
import { Box, LinearProgress, Typography, Stack } from "@mui/material";
import PixelButton from "./PixelButton/PixelButton";

interface Question {
  question: string;
  answer: boolean;
}

interface RushQuestionsPanelProps {
  questions: Question[];
  onFinish: (correctAnswers: number) => void;
  playerName: string;
}

const TIME_PER_QUESTION = 5000; // 5 segundos

const RushQuestionsPanel: React.FC<RushQuestionsPanelProps> = ({
  questions,
  onFinish,
  playerName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState<null | boolean>(null);
  const [progress, setProgress] = useState(100);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];

  // Reset y arranca el contador de cada pregunta
  useEffect(() => {
    if (showResult !== null) return; // no actualizar si está mostrando resultado
    setProgress(100);
    const start = Date.now();

    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.max(
        100 - (elapsed / TIME_PER_QUESTION) * 100,
        0
      );
      setProgress(newProgress);
      if (elapsed >= TIME_PER_QUESTION) {
        clearInterval(id);
        handleAnswer(null); // no respondió a tiempo
      }
    }, 100);

    setTimerId(id);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, showResult]);

  const handleAnswer = (value: boolean | null) => {
    if (timerId) clearInterval(timerId);
    const isCorrect = value === currentQuestion.answer;
    if (isCorrect) setCorrectAnswers((prev) => prev + 1);
    setShowResult(isCorrect ?? false);

    setTimeout(() => {
      setShowResult(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onFinish(correctAnswers + (isCorrect ? 1 : 0));
      }
    }, 1000);
  };

  return (
    <Stack spacing={4} alignItems="center">
      <Typography variant="h4" className="pixel-font text-outline">
        ¡Rush de Verdadero o Falso!
      </Typography>

      <Typography variant="h6" className="pixel-font text-outline">
        {playerName}, pregunta {currentIndex + 1} de {questions.length}
      </Typography>

      <Box
        sx={{
          backgroundColor: "Background",
          padding: 3,
          borderRadius: 2,
          minWidth: "50%",
          border: "4px solid black",
        }}
      >
        <Typography
          variant="h5"
          className="pixel-font"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          {currentQuestion.question}
        </Typography>

        {showResult === null ? (
          <Stack direction="row" spacing={4} justifyContent="center">
            <PixelButton variant="primary" onClick={() => handleAnswer(true)}>
              Verdadero
            </PixelButton>
            <PixelButton variant="alert" onClick={() => handleAnswer(false)}>
              Falso
            </PixelButton>
          </Stack>
        ) : (
          <Typography
            variant="h6"
            className="pixel-font"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            {showResult ? "✅ ¡Correcto!" : "❌ Incorrecto"}
          </Typography>
        )}

        <Box mt={3}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#ccc",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#3f51b5",
              },
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default RushQuestionsPanel;
