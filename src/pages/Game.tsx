// src/pages/Game.tsx
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useLunfardoWords } from "../hooks/useLunfardoWords";
import { RoscoWheel } from "../components/RoscoWheel";
import { QuestionPanel } from "../components/QuestionPanel";
import { Footer } from "../components/Footer";
import { RoscoGameStepsEnums } from "../enums/roscoGameEnums";
import PixelModal from "../components/Modals/PixelModal";
import { roscoBackground, roscoWheelBackgroundFinal } from "../assets";
import AnimatedLoadingText from "../components/AnimatedLoadingText";
import { RoscoResultsList } from "../components/RoscoResultsList";
import PixelButton from "../components/PixelButton/PixelButton";

interface GameProps {
  onBack: () => void;
}

export function Game({ onBack }: GameProps) {
  const { words, error, loading, fetchWords } = useLunfardoWords();
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

  useEffect(() => {
    if (words && words.data) {
      setStatuses(Array(words.data.length).fill("unanswered"));
    }
  }, [words]);

  useEffect(() => {
    if (step !== RoscoGameStepsEnums.GAMEPLAY || gameFinished) return;
    if (loading) return;
    if (timeLeft <= 0) {
      setOpenLoseModal(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, step, gameFinished, loading]);

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
    setCurrentIndex(0);
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
    setCurrentIndex(0);
    fetchWords();
    setStep(RoscoGameStepsEnums.GAMEPLAY);
  };

  const handleOnBack = () => {
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(180);
    setCurrentIndex(0);
    if (step === RoscoGameStepsEnums.START) {
      onBack();
    } else {
      setOpenGameEndModal(false);
      setOpenLoseModal(false);
      setGameFinished(false);
      setStep(RoscoGameStepsEnums.START);
    }
  };

  if (loading && step === RoscoGameStepsEnums.GAMEPLAY) {
    return (
      <Box
        display="flex"
        flex={1}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width={"100%"}
        height={"100%"}
        sx={{
          backgroundImage: `url(${roscoBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
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

  const currentWord = words?.data?.[currentIndex];
  const letters = words?.data?.map((wordObj) => wordObj.letter) ?? [];
  const definition = currentWord?.description ?? "";

  if (step === RoscoGameStepsEnums.START) {
    return (
      <Box
        display="flex"
        flex={1}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width={"100%"}
        height={"100%"}
        sx={{
          backgroundImage: `url(${roscoBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        gap={4}
      >
        <Stack alignItems="center" gap={2}>
          <Typography
            variant="h4"
            sx={{ color: "#fff" }}
            className="pixel-font text-outline"
          >
            Bienvenido a
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: "#fff" }}
            className="pixel-font text-outline"
          >
            ¡El Rosco del Lunfardo!
          </Typography>

          <Box sx={{ mx: 50, textAlign: "center", my: 4 }}>
            <Typography
              variant="body1"
              sx={{ color: "#fff" }}
              className="pixel-font text-outline"
            >
              Respondé correctamente todas las definiciones antes de que se
              acabe el tiempo. ¿Estás listo?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 4 }}>
            <PixelButton onClick={handleStartGame} variant="secondary">
              EMPEZAR
            </PixelButton>

            <PixelButton onClick={onBack} variant="alert">
              VOLVER
            </PixelButton>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        backgroundImage: `url(${roscoBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <Typography
            variant="h6"
            className="pixel-font text-outline"
            sx={{
              flex: 1,
              fontWeight: "600",
            }}
          >
            Rosco
          </Typography>
          <PixelButton onClick={handleOnBack} variant="alert">
            VOLVER
          </PixelButton>
        </Toolbar>
      </AppBar>
      {step === RoscoGameStepsEnums.RESULTS ? (
        <Container
          sx={{
            mt: 12,
            display: "flex",
            gap: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <RoscoWheel
              letters={letters}
              statuses={statuses}
              currentIndex={-1}
              background={roscoWheelBackgroundFinal}
            />
          </Box>
          <Box width={500}>
            <RoscoResultsList words={words!.data} statuses={statuses} />
          </Box>
        </Container>
      ) : (
        <Container
          sx={{
            flex: 1,
            mt: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2} justifyContent="center">
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
      )}

      <PixelModal
        open={openLoseModal}
        onClose={() => {
          setStep(RoscoGameStepsEnums.RESULTS);
          setOpenLoseModal(false);
        }}
        title="¡Tiempo agotado!"
        message="No te alcanzó el tiempo para terminar. ¡Intentalo de nuevo!"
      />
      <PixelModal
        open={openGameEndModal}
        onClose={() => {
          setStep(RoscoGameStepsEnums.RESULTS);
          setOpenGameEndModal(false);
        }}
        title="¡Juego terminado! 🎉"
        message={`Obtuviste ${correctCount} respuestas correctas y ${wrongCount} incorrectas.`}
      />
      <Footer />
    </Box>
  );
}

export default Game;
