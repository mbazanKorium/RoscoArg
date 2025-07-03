// src/components/AnimatedLoadingText.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const AnimatedLoadingText: React.FC = () => {
  const baseText = "Cargando";
  const dotSteps = ["", ".", "..", "..."];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % dotSteps.length);
    }, 300);
    return () => clearInterval(interval);
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        sx={{
          mt: 1,
          animation: "fadeIn 0.3s ease-in-out",
          color: "#1f2937",
        }}
      >
        {baseText}
        {dotSteps[currentStep]}
      </Typography>
    </Box>
  );
};

export default AnimatedLoadingText;
