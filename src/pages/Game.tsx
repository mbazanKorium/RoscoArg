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
import AnimatedLoadingText from "../components/AnimatedLoadingText";
import { RoscoGameStepsEnums } from "../enums/roscoGameEnums";
import PixelModal from "../components/Modals/PixelModal";

interface GameProps {
  onBack: () => void;
}

export function Game({ onBack }: GameProps) {
  const { words, error, fetchWords } = useLunfardoWords();
  const [step, setStep] = useState(RoscoGameStepsEnums.START);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  const [openLoseModal, setOpenLoseModal] = useState(false);
  const [openGameEndModal, setOpenGameEndModal] = useState(false);

  const [gameFinished, setGameFinished] = useState(false);
  const [statuses, setStatuses] = useState<
    ("unanswered" | "correct" | "mistake" | "skip")[]
  >([]);
  const currentWord = words?.data?.[currentIndex];

  useEffect(() => {
    if (words && words.data) {
      setStatuses(Array(words.data.length).fill("unanswered"));
    }
  }, [words]);

  useEffect(() => {
    console.log("Paso actual:", step);
    console.log("Palabras:", words);
    console.log("Error:", error);
  }, [step, words, error]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  useEffect(() => {
    if (step !== RoscoGameStepsEnums.GAMEPLAY || gameFinished) return;
    if (timeLeft <= 0) {
      setOpenLoseModal(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, step, gameFinished]);

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

  const finishGame = () => {
    setGameFinished(true);
    setOpenGameEndModal(true);
    setStep(RoscoGameStepsEnums.RESULTS);
  };

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

  const handleStartGame = () => {
    setStep(RoscoGameStepsEnums.GAMEPLAY);
  };

  const handleOnBack = () => {
    setOpenGameEndModal(false);
    setOpenLoseModal(false);
    setGameFinished(false);
    onBack();
  };

  if (!currentWord && step === RoscoGameStepsEnums.GAMEPLAY) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="200px"
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
        <Typography color="error" className="pixel-font text-outline">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (
    step === RoscoGameStepsEnums.GAMEPLAY &&
    (!words || !words.data || words.data.length === 0)
  ) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography className="pixel-font text-outline">
          Cargando palabras...
        </Typography>
      </Box>
    );
  }

  if (!currentWord) return null;

  const letters = words?.data?.map((wordObj) => wordObj.letter) ?? [];
  const definition = currentWord?.description ?? "";

  if (step === RoscoGameStepsEnums.START) {
    return (
      <PixelModal
        open={true}
        onClose={handleStartGame}
        title="¡Bienvenido al Rosco Lunfardo!"
        message="Respondé correctamente todas las definiciones antes de que se acabe el tiempo. ¿Estás listo?"
        buttonText="Comenzar"
      />
    );
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <Typography
            variant="h6"
            className="pixel-font text-outline"
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
      <PixelModal
        open={openLoseModal}
        onClose={handleOnBack}
        title="¡Tiempo agotado!"
        message="No te alcanzó el tiempo para terminar. ¡Intentalo de nuevo!"
      />
      <PixelModal
        open={openGameEndModal}
        onClose={handleOnBack}
        title="¡Juego terminado! 🎉"
        message={`Obtuviste ${correctCount} respuestas correctas y ${wrongCount} incorrectas.`}
        buttonText="Volver"
      />
      <Footer />
    </>
  );
}

export default Game;
