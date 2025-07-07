// src/components/ConurbanoGame/BackButton.tsx
import React from "react";
import { Box } from "@mui/material";
import PixelButton from "./PixelButton/PixelButton";

interface Props {
  onClick: () => void;
}

const BackButton: React.FC<Props> = ({ onClick }) => (
  <Box
    sx={{
      position: "fixed",
      bottom: 20,
      right: 20,
      zIndex: 999,
    }}
  >
    <PixelButton
      onClick={onClick}
      backgroundColor="#f00"
      hoverBackground="#b30000"
      borderColor="#000"
      color="#fff"
      hoverColor="#fff"
    >
      VOLVER
    </PixelButton>
  </Box>
);

export default BackButton;
