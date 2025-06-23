// src/components/RhythmGame.tsx
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
}

const RhythmGame: React.FC<RhythmGameProps> = ({
  difficulty,
  onGameEnd,
  onError,
}) => {
  const [sequence, setSequence] = useState<(keyof typeof arrowMap)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const correctSound = useRef(new Audio(correctSoundSrc));
  const wrongSound = useRef(new Audio(wrongSoundSrc));

  const sequenceLength =
    difficulty === "Fácil" ? 5 : difficulty === "Normal" ? 8 : 12;

  useEffect(() => {
    // Generar secuencia aleatoria
    const randomSequence = Array.from(
      { length: sequenceLength },
      () => keys[Math.floor(Math.random() * keys.length)]
    );
    setSequence(randomSequence);
  }, [difficulty, sequenceLength]);

  useEffect(() => {
    correctSound.current.volume = 0.1;
    wrongSound.current.volume = 0.2;
  }, []);

  useEffect(() => {
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
  }, [sequence, currentIndex, onGameEnd, onError]);

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h5" className="pixel-font text-outline">
        ¡Presiona las teclas en el orden correcto!
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        {sequence.map((key, index) => (
          <img
            key={index}
            src={arrowMap[key]}
            alt={key}
            style={{
              width: 50,
              height: 50,
              opacity: index === currentIndex ? 1 : 0.5,
              transition: "transform 0.2s",
              transform: index === currentIndex ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RhythmGame;
