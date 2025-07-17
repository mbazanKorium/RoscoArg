// src/components/ConurbanoGame/MusicToggle.tsx
import React from "react";
import { Box } from "@mui/material";
import { muteIcon, volumeIcon } from "../../assets";

interface Props {
  isMuted: boolean;
  onToggle: () => void;
}

const MusicToggle: React.FC<Props> = ({ isMuted, onToggle }) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 999,
      cursor: "pointer",
    }}
    onClick={onToggle}
  >
    <img
      src={isMuted ? muteIcon : volumeIcon}
      alt={isMuted ? "Mute" : "Volume on"}
      style={{
        width: "75%",
        height: 100,
        objectFit: "contain",
        display: "block",
        margin: "0 auto",
      }}
    />
  </Box>
);

export default MusicToggle;
