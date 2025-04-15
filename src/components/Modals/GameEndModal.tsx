import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ScoreBoard } from "../ScoreBoard";

interface Props {
  open: boolean;
  correctCount: number;
  wrongCount: number;
  onBack: () => void;
  onClose: () => void;
}

export const GameEndModal: React.FC<Props> = ({
  open,
  correctCount,
  wrongCount,
  onBack,
  onClose,
}) => {
  const [modalMessage, setModalMessage] = useState<string>("");

  useEffect(() => {
    if (correctCount > 20) {
      setModalMessage("Estuviste excelente!");
    } else if (correctCount > 10 && correctCount < 20) {
      setModalMessage(
        "Estas en el promedio, lo cual significa que podes mejorar!"
      );
    } else if (correctCount < 10) {
      setModalMessage("Upa! Vamos a tener que ir practicando ese lunfardo");
    }
  }, [correctCount]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"sm"}>
      <DialogTitle>Terminaste! 🎉🥳🎉</DialogTitle>
      <DialogContent>
        <Typography>
          Este es el resultado de tu conocimiento en el lunfardo argentino.
        </Typography>
        <ScoreBoard correctCount={correctCount} wrongCount={wrongCount} />
        <Typography sx={{ mt: 2 }}>{modalMessage}</Typography>
        <Typography>Intentalo nuevamente!.</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Button
            onClick={onBack}
            sx={{
              textTransform: "capitalize",
              color: "#fff",
              backgroundColor: (theme) => theme.palette.main.button,
            }}
          >
            Volver
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
