// src/components/PixelButton.tsx
import React from "react";
import { Box } from "@mui/material";

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  borderColor?: string;
  hoverColor?: string;
  hoverBackground?: string;
  backgroundColor?: string;
  padding?: string;
  fontSize?: string;
  width?: string | number;
  height?: string | number;
}

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  color = "#0f0",
  borderColor = "#0f0",
  hoverColor = "#646cff",
  backgroundColor = "#cacaca",
  hoverBackground = "#636363",
  padding = "10px 20px",
  fontSize = "12px",
  width = "auto",
  height = "auto",
}) => {
  return (
    <Box
      onClick={onClick}
      className="pixel-font"
      sx={{
        cursor: "pointer",
        backgroundColor,
        color,
        border: `3px solid ${borderColor}`,
        padding,
        fontSize,
        width,
        height,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        transition: "all 0.2s ease",
        boxShadow: `4px 4px 0 ${borderColor}`,
        textTransform: "uppercase",
        "&:hover": {
          color: hoverColor,
          backgroundColor: hoverBackground,
          transform: "translate(2px, 2px)",
          boxShadow: `2px 2px 0 ${borderColor}`,
        },
        "&:active": {
          transform: "translate(4px, 4px) scale(0.95)",
          boxShadow: `1px 1px 0 ${borderColor}`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default PixelButton;
