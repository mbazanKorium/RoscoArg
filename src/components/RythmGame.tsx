import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { arrowUp, arrowRight, arrowDown, arrowLeft } from "../assets";
import { correctSoundSrc, wrongSoundSrc } from "../assets/sounds";

const arrowMap = {
  ArrowUp: arrowUp,
  ArrowRight: arrowRight,
  ArrowDown: arrowDown,
  ArrowLeft: arrowLeft,
};

const keys = Object.keys(arrowMap) as (keyof typeof arrowMap)[];

interface RhythmGameProps {
  difficulty: "Fácil" | "Normal" | "Difícil";
  onGameEnd: () => void;
  onError: () => void;
  onTimeOut: () => void;
}

const RhythmGame: React.FC<RhythmGameProps> = ({
  difficulty,
  onGameEnd,
  onError,
  onTimeOut,
}) => {
  const [sequence, setSequence] = useState<(keyof typeof arrowMap)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [preCountdown, setPreCountdown] = useState(3);

  const correctSound = useRef(new Audio(correctSoundSrc));
  const wrongSound = useRef(new Audio(wrongSoundSrc));

  const sequenceLength =
    difficulty === "Fácil" ? 5 : difficulty === "Normal" ? 8 : 10;

  const maxTime =
    difficulty === "Fácil" ? 15 : difficulty === "Normal" ? 10 : 7;

  useEffect(() => {
    // Generar secuencia aleatoria
    const randomSequence = Array.from(
      { length: sequenceLength },
      () => keys[Math.floor(Math.random() * keys.length)]
    );
    setSequence(randomSequence);
    setTimeLeft(maxTime);
    setGameStarted(false);
    setPreCountdown(3);
  }, [difficulty, maxTime, sequenceLength]);

  useEffect(() => {
    correctSound.current.volume = 0.3;
    wrongSound.current.volume = 0.2;
  }, []);

  useEffect(() => {
    if (preCountdown <= 0) {
      setGameStarted(true);
      return;
    }

    const preTimer = setTimeout(() => {
      setPreCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(preTimer);
  }, [preCountdown]);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev - 1 <= 0) {
          clearInterval(timer);
          onTimeOut();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, onTimeOut]);

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === sequence[currentIndex]) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
        setCurrentIndex((prev) => {
          if (prev + 1 === sequence.length) {
            onGameEnd();
          }
          return prev + 1;
        });
      } else {
        wrongSound.current.pause();
        wrongSound.current.currentTime = 0;
        wrongSound.current.play();
        onError();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sequence, currentIndex, gameStarted, onGameEnd, onError]);

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      {!gameStarted ? (
        <Typography
          variant="h3"
          className="pixel-font text-outline"
          sx={{ color: "#fff", mt: 4 }}
        >
          {preCountdown > 0 ? `¡Prepárate... ${preCountdown}!` : "¡YA!"}
        </Typography>
      ) : (
        <>
          <Typography variant="h5" className="pixel-font text-outline">
            ¡Presiona las teclas en el orden correcto!
          </Typography>
          <Typography
            variant="h4"
            sx={{ mt: 2, mb: 4 }}
            className="pixel-font text-outline"
          >
            Tiempo restante: {timeLeft}s
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            {sequence.map((key, index) => (
              <img
                key={index}
                src={arrowMap[key]}
                alt={key}
                style={{
                  width: 100,
                  height: 100,
                  opacity: index === currentIndex ? 1 : 0.5,
                  transition: "transform 0.2s",
                  transform: index === currentIndex ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default RhythmGame;
