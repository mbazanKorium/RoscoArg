import React from "react";
import Box from "@mui/material/Box";
import { playerBackground } from "../assets";
import Typography from "@mui/material/Typography";

interface GameProps {
  image: string;
  label: string;
}

interface Props {
  game: GameProps;
  isSelected: boolean;
  onClick: () => void;
}

export const PlayerSelectBox: React.FC<Props> = ({
  game,
  isSelected,
  onClick,
}) => {
  return (
    <Box
      sx={{
        height: 500,
        width: 600,
        borderRadius: 5,
        backgroundImage: `url(${playerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        border: isSelected ? "4px solid #00FF00" : "2px solid transparent",
        filter: isSelected ? "none" : "grayscale(100%) brightness(0.7)",
        opacity: isSelected ? 1 : 0.7,
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <img
        src={game.image}
        alt={game.label}
        style={{
          width: "100%",
          height: 400,
          objectFit: "contain",
          display: "block",
          margin: "0 auto",
        }}
      />

      <Box
        sx={{
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#fff", textAlign: "center" }}
          className="pixel-font text-outline"
        >
          {game.label}
        </Typography>
      </Box>
    </Box>
  );
};
