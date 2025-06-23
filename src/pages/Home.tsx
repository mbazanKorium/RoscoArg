// src/pages/Home.tsx
import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { termoImg, roscoImg, conurbanoImg } from "../assets";

const GameOption = styled(Box)<{
  focused: boolean;
  blurred: boolean;
  background: string;
}>(({ focused, blurred, theme, background }) => ({
  position: "relative",
  cursor: "pointer",
  transition: "all 0.5s ease",
  overflow: "hidden",
  filter: blurred ? "blur(3px)" : "none",
  opacity: blurred ? 0.4 : 1,
  zIndex: focused ? 2 : 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: background,
  padding: theme.spacing(4),
  borderRadius: 0,
  height: "100vh",
}));

const gameOptions = [
  {
    label: "Termo-Neitor",
    image: termoImg,
    route: "/termo-neitor",
    background: "#dff6fd",
  },
  {
    label: "Rosco",
    image: roscoImg,
    route: "/rosco",
    background: "#ffffff",
  },
  {
    label: "Descubriendo el conurbano",
    image: conurbanoImg,
    route: "/conurbano",
    background: "#dff6fd",
  },
];

const Home: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        fontFamily: "'Irish Grover', cursive",
        zIndex: 0,
      }}
    >
      {gameOptions.map((game, index) => {
        const isHovered = hovered === index;
        const isBlurred = hovered !== null && hovered !== index;

        return (
          <Box
            key={index}
            flex={hovered === null ? 1 : isHovered ? 6 : 1}
            sx={{ transition: "all 0.5s ease", height: "100%" }}
          >
            <GameOption
              focused={isHovered}
              blurred={isBlurred}
              background={game.background}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(game.route)}
              sx={{ gap: 8 }}
            >
              <Typography variant="h2" className="game-title">
                {game.label}
              </Typography>
              <img
                src={game.image}
                alt={game.label}
                style={{ width: 400, height: 400, objectFit: "contain" }}
              />
            </GameOption>
          </Box>
        );
      })}
    </Box>
  );
};

export default Home;
