import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

interface Props {
  open: boolean;
  onBack: () => void;
  onClose: () => void;
}

export const YouLoseModal: React.FC<Props> = ({ open, onBack, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"sm"}>
      <DialogTitle>Perdiste! 😔</DialogTitle>
      <DialogContent>
        <Typography>
          No te alcanzo el tiempo para terminar con las palabras.
        </Typography>
        <Typography>Intentalo nuevamente!.</Typography>
        <Button onClick={onBack}>Volver</Button>
      </DialogContent>
    </Dialog>
  );
};
