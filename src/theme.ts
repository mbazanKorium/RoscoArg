// src/theme.ts
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    main: {
      background: string;
      button: string;
      letter: string;
      letterSuccess: string;
      letterSkip: string;
      letterMistake: string;
    };
  }
  interface PaletteOptions {
    main?: {
      background?: string;
      button?: string;
      letter?: string;
      letterSuccess?: string;
      letterSkip?: string;
      letterMistake?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    main: {
      button: "#1d4ed8",
      background: "#f3f4f6",
      letter: "#389cfc",
      letterSuccess: "#30ca52",
      letterSkip: "#d6be20",
      letterMistake: "#fe0032",
    },
  },
});

export default theme;
