import React from "react";
import { Box, Typography } from "@mui/material";

interface ModeOption {
  image: string;
  label: string;
}

interface Props {
  mode: ModeOption;
  isSelected: boolean;
  onClick: () => void;
}

const ModeSelectImageBox: React.FC<Props> = ({ mode, isSelected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 300,
        height: 350,
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        transform: isSelected ? "scale(1.05)" : "scale(1)",
        boxShadow: isSelected
          ? "0 0 15px 5px rgba(0, 255, 0, 0.8)"
          : "0 0 5px rgba(0,0,0,0.5)",
        filter: isSelected ? "none" : "grayscale(100%) brightness(0.6)",
      }}
    >
      <img
        src={mode.image}
        alt={mode.label}
        style={{ width: "100%", height: "85%", objectFit: "cover" }}
      />
      <Box
        sx={{
          height: "15%",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          className="pixel-font text-outline"
          sx={{ color: "#fff" }}
        >
          {mode.label}
        </Typography>
      </Box>
    </Box>
  );
};

export default ModeSelectImageBox;
