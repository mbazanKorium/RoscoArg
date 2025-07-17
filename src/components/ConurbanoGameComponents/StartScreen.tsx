// src/components/ConurbanoGame/StartScreen.tsx
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import PixelButton from "../PixelButton/PixelButton";

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const StartScreen: React.FC<Props> = ({ onStart, onBack }) => {
  return (
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
        ¡Descubriendo El Conurbano!
      </Typography>

      <Box sx={{ mx: 50, textAlign: "center", my: 4 }}>
        <Typography
          variant="body1"
          sx={{ color: "#fff" }}
          className="pixel-font text-outline"
        >
          En este juego debes adivinar en qué lugar del conurbano bonaerense te
          encontrás. Tendrás que reconocer todo tipo de señales: nombres de
          calles, edificios y quizás hasta un árbol.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        <PixelButton
          onClick={onStart}
          borderColor="#969696"
          hoverBackground="#898989"
          hoverColor="#000"
          color="#000"
        >
          EMPEZAR
        </PixelButton>

        <PixelButton
          onClick={onBack}
          borderColor="#000"
          hoverColor="#f00"
          backgroundColor="#f00"
          hoverBackground="#b30000"
          color="#fff"
        >
          VOLVER
        </PixelButton>
      </Box>
    </Stack>
  );
};

export default StartScreen;
