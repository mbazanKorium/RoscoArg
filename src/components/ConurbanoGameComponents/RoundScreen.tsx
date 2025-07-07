// src/components/ConurbanoGame/RoundScreen.tsx
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import PixelButton from "../PixelButton/PixelButton";
import LeafletMapSelector from "../LeafletMapSelector";
import { ConurbanoGameStepsEnums } from "../../enums/conurbanoGameEnums";

interface Props {
  currentRound: number;
  maxRounds: number;
  currentPlayerIndex: 0 | 1 | null;
  isMultiplayer: boolean;
  getCurrentPlayerName: () => string;
  panoramaRef: React.RefObject<HTMLDivElement>;
  mapRef: React.RefObject<HTMLDivElement>;
  guessCoords: { lat: number; lng: number } | null;
  guessAddress: string | null;
  roundScore: number | null;
  handleSubmitGuess: () => void;
  isLastRound: () => boolean;
  nextRound: () => void;
  setStep: (s: ConurbanoGameStepsEnums) => void;
  ConurbanoGameStepsEnums: ConurbanoGameStepsEnums;
  realCoords: { lat: number; lng: number } | null;
  showRealMarker: boolean;
  polylineCoords: Array<[number, number]>;
  isMapLocked: boolean;
  handleMapClick: (coords: { lat: number; lng: number }) => void;
}

const RoundScreen: React.FC<Props> = ({
  currentRound,
  maxRounds,
  currentPlayerIndex,
  isMultiplayer,
  getCurrentPlayerName,
  panoramaRef,
  guessCoords,
  guessAddress,
  roundScore,
  handleSubmitGuess,
  isLastRound,
  nextRound,
  setStep,
  ConurbanoGameStepsEnums,
  realCoords,
  showRealMarker,
  polylineCoords,
  isMapLocked,
  handleMapClick,
}) => {
  return (
    <Stack alignContent="center" alignItems="center" gap={2}>
      <Typography variant="h4" gutterBottom className="pixel-font text-outline">
        Descubriendo el Conurbano - Ronda {currentRound}/{maxRounds}
      </Typography>

      {currentRound !== 0 && (
        <Typography
          className="pixel-font text-outline"
          sx={{ color: "#fff", mb: 2 }}
        >
          Turno de: {getCurrentPlayerName()}
        </Typography>
      )}

      <Stack direction="row" spacing={4} mt={4}>
        <Box
          ref={panoramaRef}
          sx={{
            width: "45vw",
            height: "60vh",
            borderRadius: "10px",
            border: 4,
            borderColor: "#000",
            borderLeftColor: "#cacaca",
            borderTopColor: "#cacaca",
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />

        <Box
          sx={{
            width: "45vw",
            height: "60vh",
            borderRadius: "10px",
            border: 4,
            borderColor: "#000",
            borderRightColor: "#cacaca",
            borderBottomColor: "#cacaca",
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <LeafletMapSelector
            guess={guessCoords}
            real={showRealMarker ? realCoords : null}
            polylineCoords={polylineCoords}
            onMapClick={handleMapClick}
            isSecondPlayerGuess={isMultiplayer && currentPlayerIndex === 1}
            isLocked={isMapLocked}
          />
        </Box>
      </Stack>

      <Stack>
        {guessCoords && roundScore === null && (
          <Stack mt={4} spacing={2} width="50%" alignSelf="center">
            <Typography className="pixel-font text-outline">
              {guessAddress
                ? `Tu elección: ${guessAddress}`
                : `lat ${guessCoords.lat.toFixed(
                    4
                  )}, lng ${guessCoords.lng.toFixed(4)}`}
            </Typography>

            <PixelButton
              borderColor="#969696"
              hoverBackground="#898989"
              backgroundColor="#cacaca"
              hoverColor="#000"
              color="#000"
              onClick={handleSubmitGuess}
            >
              Enviar Adivinanza
            </PixelButton>
          </Stack>
        )}
      </Stack>

      {roundScore !== null && (
        <PixelButton
          borderColor="#1979e6"
          hoverBackground="#0d4380"
          backgroundColor="#1565c0"
          hoverColor="#FFF"
          color="#FFF"
          onClick={() => {
            if (isLastRound()) {
              setStep(ConurbanoGameStepsEnums);
            } else {
              nextRound();
            }
          }}
        >
          {isLastRound() ? "Ver Puntajes" : "Siguiente Ronda"}
        </PixelButton>
      )}
    </Stack>
  );
};

export default RoundScreen;
