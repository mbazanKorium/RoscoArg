// src/components/PixelButton.tsx
import React from "react";
import { Box, SxProps } from "@mui/material";

type Variant = "primary" | "secondary" | "alert" | "action";

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  sx?: SxProps;
  color?: string;
  borderColor?: string;
  hoverColor?: string;
  hoverBackground?: string;
  backgroundColor?: string;
  padding?: string;
  fontSize?: string;
  width?: string | number;
  height?: string | number;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<Variant, Partial<PixelButtonProps>> = {
  primary: {
    backgroundColor: "#1565c0",
    borderColor: "#1979e6",
    hoverBackground: "#0d4380",
    color: "#fff",
    hoverColor: "#fff",
  },
  secondary: {
    backgroundColor: "#cacaca",
    borderColor: "#969696",
    hoverBackground: "#898989",
    color: "#000",
    hoverColor: "#000",
  },
  alert: {
    backgroundColor: "#f00",
    borderColor: "#000",
    hoverBackground: "#b30000",
    color: "#fff",
    hoverColor: "#fff",
  },
  action: {
    backgroundColor: "#2e7d32",
    borderColor: "#1b5e20",
    hoverBackground: "#1b5e20",
    color: "#fff",
    hoverColor: "#fff",
  },
};

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant,
  color,
  borderColor,
  hoverColor,
  hoverBackground,
  backgroundColor,
  padding = "10px 20px",
  fontSize = "12px",
  width = "auto",
  height = "auto",
  disabled,
  sx = {},
}) => {
  const variantStyles = variant ? VARIANT_STYLES[variant] : {};

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick?.();
      }}
      className="pixel-font"
      sx={{
        cursor: disabled ? "default" : "pointer",
        backgroundColor:
          backgroundColor ?? variantStyles.backgroundColor ?? "#cacaca",
        color: color ?? variantStyles.color ?? "#0f0",
        border: `3px solid ${
          borderColor ?? variantStyles.borderColor ?? "#0f0"
        }`,
        padding,
        fontSize,
        width,
        height,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        transition: "all 0.2s ease",
        boxShadow: `4px 4px 0 ${
          borderColor ?? variantStyles.borderColor ?? "#0f0"
        }`,
        textTransform: "uppercase",
        "&:hover": {
          color: hoverColor ?? variantStyles.hoverColor ?? "#646cff",
          backgroundColor:
            hoverBackground ?? variantStyles.hoverBackground ?? "#636363",
          transform: "translate(2px, 2px)",
          boxShadow: `2px 2px 0 ${
            borderColor ?? variantStyles.borderColor ?? "#0f0"
          }`,
        },
        "&:active": {
          transform: "translate(4px, 4px) scale(0.95)",
          boxShadow: `1px 1px 0 ${
            borderColor ?? variantStyles.borderColor ?? "#0f0"
          }`,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default PixelButton;
