import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { modalBackground } from "../../assets";
import PixelButton from "../PixelButton/PixelButton";

interface PixelModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const PixelModal: React.FC<PixelModalProps> = ({
  open,
  onClose,
  title,
  message,
  buttonText = "Aceptar",
}) => {
  return (
    <>
      {/* Backdrop */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: open ? "auto" : "none",
          zIndex: 1299,
        }}
        onClick={onClose} // clic fuera del modal cierra también
      />

      {/* Modal */}
      <Box
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: open
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.9)",
          opacity: open ? 1 : 0,
          transition: "all 0.3s ease",
          width: 800,
          height: 400,
          backgroundImage: `url(${modalBackground})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          textAlign: "center",
          fontFamily: "monospace",
          zIndex: 1300,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <Stack sx={{ gap: 4, mx: 2 }}>
          <Typography
            variant="h5"
            sx={{ color: "#000" }}
            className="pixel-font"
            gutterBottom
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#000" }}
            className="pixel-font"
            gutterBottom
          >
            {message}
          </Typography>
          <Box>
            <PixelButton
              onClick={onClose}
              backgroundColor="#fff"
              hoverBackground="#cacaca"
              borderColor="#969696"
              hoverColor="#000"
              color="#000"
            >
              {buttonText}
            </PixelButton>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default PixelModal;
