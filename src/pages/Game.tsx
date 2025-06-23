// src/pages/Game.tsx
import { useEffect, useState } from "react";
import "../App.css";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useLunfardoWords } from "../hooks/useLunfardoWords";
import { RoscoWheel } from "../components/RoscoWheel";
import { QuestionPanel } from "../components/QuestionPanel";
import { Footer } from "../components/Footer";
import { YouLoseModal } from "../components/Modals/YouLoseModal";
import AnimatedLoadingText from "../components/AnimatedLoadingText";
import { GameEndModal } from "../components/Modals/GameEndModal";

interface GameProps {
  onBack: () => void;
}

export function Game({ onBack }: GameProps) {
  const { words, loading, error, fetchWords } = useLunfardoWords();

  // Estados del juego
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  const [openLoseModal, setOpenLoseModal] = useState(false);
  const [openGameEndModal, setOpenGameEndModal] = useState(false);

  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(3);

  const [gameFinished, setGameFinished] = useState(false);

  // Estado para mantener el estado de cada palabra:
  // Los valores pueden ser "unanswered", "correct", "mistake" o "skip"
  const [statuses, setStatuses] = useState<
    ("unanswered" | "correct" | "mistake" | "skip")[]
  >([]);

  // Inicializar los estados cuando se carguen las palabras
  useEffect(() => {
    if (words && words.data) {
      setStatuses(Array(words.data.length).fill("unanswered"));
    }
  }, [words]);

  useEffect(() => {
    if (!showCountdown || loading) return;
    if (countdownValue <= 0) {
      // Termina conteo y comienza el juego
      setShowCountdown(false);
      setOpenGameEndModal(false);
      return;
    }
    const timer = setTimeout(() => {
      setCountdownValue((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showCountdown, countdownValue, loading]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  // Temporizador: decrementa cada segundo
  useEffect(() => {
    if (showCountdown || gameFinished) return; // no arranca hasta que acaba el conteo o si el juego ya terminó
    if (timeLeft <= 0) {
      setOpenLoseModal(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showCountdown, gameFinished]);

  // Función auxiliar para obtener el siguiente índice que no tenga respuesta final
  const getNextWordIndex = (start: number): number | null => {
    if (!words?.data) return null;
    const len = words.data.length;
    let idx = start;
    for (let i = 0; i < len; i++) {
      idx = (start + i) % len;
      if (statuses[idx] === "unanswered" || statuses[idx] === "skip") {
        return idx;
      }
    }
    return null;
  };

  // Función para finalizar el juego (podrías mostrar un resumen o reiniciar)
  const finishGame = () => {
    setGameFinished(true);
    setOpenGameEndModal(true);
  };

  // Manejo de respuesta: actualizar estado a "correct" o "mistake"
  const handleAnswerSubmit = () => {
    if (!words?.data || currentIndex >= words.data.length) return;
    const currentWord = words.data[currentIndex];
    let newStatus: "correct" | "mistake" = "mistake";
    if (
      userAnswer.trim().toLowerCase() === currentWord.word.trim().toLowerCase()
    ) {
      newStatus = "correct";
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
    setStatuses((prev) => {
      const copy = [...prev];
      copy[currentIndex] = newStatus;
      return copy;
    });
    setUserAnswer("");
    const nextIdx = getNextWordIndex(currentIndex + 1);
    if (nextIdx !== null) {
      setCurrentIndex(nextIdx);
    } else {
      finishGame();
    }
  };

  // Manejo de "Pasapalabra": asigna el estado "skip"
  const handleSkip = () => {
    if (!words?.data || currentIndex >= words.data.length) return;
    setStatuses((prev) => {
      const copy = [...prev];
      copy[currentIndex] = "skip";
      return copy;
    });
    setUserAnswer("");
    const nextIdx = getNextWordIndex(currentIndex + 1);
    if (nextIdx !== null) {
      setCurrentIndex(nextIdx);
    } else {
      finishGame();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems={"center"}
        flexDirection={"column"}
        width={"200px"}
        mt={4}
        gap={4}
      >
        <CircularProgress size={80} />
        <AnimatedLoadingText />
      </Box>
    );
  }
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
  if (!words || !words.data || words.data.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No se encontraron palabras.</Typography>
      </Box>
    );
  }

  const currentWord = words.data[currentIndex];
  const letters = words.data.map((wordObj) => wordObj.letter);
  const definition = currentWord.description;

  if (showCountdown) {
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
              sx={{
                textTransform: "capitalize",
                color: "#fff",
                backgroundColor: (theme) => theme.palette.main.button,
              }}
              onClick={onBack}
            >
              Volver
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 10, textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{ fontSize: "5rem", fontWeight: "bold", color: "#000" }}
          >
            {countdownValue > 0 ? countdownValue : "¡A jugar!"}
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  const handleOnBack = () => {
    setOpenGameEndModal(false);
    setOpenLoseModal(false);
    setGameFinished(false);
    onBack();
  };

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
            sx={{
              textTransform: "capitalize",
              color: "#fff",
              backgroundColor: (theme) => theme.palette.main.button,
            }}
            onClick={handleOnBack}
          >
            Volver
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={6} justifyContent="center">
          <Grid size={12} textAlign="center">
            <RoscoWheel
              letters={letters}
              statuses={statuses}
              currentIndex={currentIndex}
            />
          </Grid>
          <Grid size={16}>
            <QuestionPanel
              definition={definition}
              userAnswer={userAnswer}
              correctCount={correctCount}
              wrongCount={wrongCount}
              timeLeft={timeLeft}
              setUserAnswer={setUserAnswer}
              onAnswerSubmit={handleAnswerSubmit}
              onSkip={handleSkip}
            />
          </Grid>
        </Grid>
      </Container>
      <YouLoseModal
        open={openLoseModal}
        onClose={() => setOpenLoseModal(false)}
        onBack={handleOnBack}
      />
      <GameEndModal
        open={openGameEndModal}
        correctCount={correctCount}
        wrongCount={wrongCount}
        onBack={handleOnBack}
        onClose={() => setOpenGameEndModal(false)}
      />
      <Footer />
    </>
  );
}

export default Game;
