// src/components/ConurbanoGame/PlayerSelectionScreen.tsx
import React from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import PixelButton from "../PixelButton/PixelButton";
import { PlayerSelectBox } from "../PlayerSelectBox";
import { fultbolGames, playerGames } from "../../constants/playerOptions";
import { ConurbanoGameStepsEnums } from "../../enums/conurbanoGameEnums";

interface Props {
  isFutbolImgEnabled: boolean;
  foundEasterEgg: boolean;
  selectedPlayerCountIndex: number | null;
  setSelectedPlayerCountIndex: (i: number) => void;
  setIsMultiplayer: (v: boolean) => void;
  setInputPlayersName: (v: boolean) => void;
  inputPlayersName: boolean;
  isMultiplayer: boolean;
  player1Name: string;
  setPlayer1Name: (v: string) => void;
  player2Name: string;
  setPlayer2Name: (v: string) => void;
  initRound: () => void;
  setStep: (s: ConurbanoGameStepsEnums) => void;
  ConurbanoGameStepsEnums: ConurbanoGameStepsEnums;
}

const PlayerSelectionScreen: React.FC<Props> = ({
  isFutbolImgEnabled,
  foundEasterEgg,
  selectedPlayerCountIndex,
  setSelectedPlayerCountIndex,
  setIsMultiplayer,
  setInputPlayersName,
  inputPlayersName,
  isMultiplayer,
  player1Name,
  setPlayer1Name,
  player2Name,
  setPlayer2Name,
  initRound,
  setStep,
  ConurbanoGameStepsEnums,
}) => {
  const gameOptions = isFutbolImgEnabled ? fultbolGames : playerGames;

  const canStart =
    inputPlayersName &&
    ((isMultiplayer &&
      player1Name.trim().length >= 3 &&
      player2Name.trim().length >= 3) ||
      (!isMultiplayer && player1Name.trim().length >= 3));

  return (
    <Box>
      {foundEasterEgg && (
        <Typography
          variant="h5"
          sx={{ color: "#fff", textAlign: "center", mb: 2 }}
          className="pixel-font text-outline"
        >
          Modo Futbol: {isFutbolImgEnabled ? "ON" : "OFF"}
        </Typography>
      )}

      <Typography
        variant="body1"
        sx={{ color: "#fff", textAlign: "center" }}
        className="pixel-font text-outline"
      >
        Elegí si querés jugar solo o con alguien más.
      </Typography>

      <Stack direction="column" alignItems="center" spacing={4} mt={5}>
        <Stack direction="row" spacing={4}>
          {gameOptions.map((x, i) => (
            <PlayerSelectBox
              key={i}
              game={x}
              isSelected={selectedPlayerCountIndex === i}
              onClick={() => {
                setIsMultiplayer(i === 1);
                setSelectedPlayerCountIndex(i);
                setInputPlayersName(true);
              }}
            />
          ))}
        </Stack>

        {inputPlayersName && (
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: 2,
                width: 300,
              }}
            >
              <TextField
                label="Nombre Jugador 1"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                fullWidth
              />
            </Box>

            {isMultiplayer && (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: 2,
                  width: 300,
                }}
              >
                <TextField
                  label="Nombre Jugador 2"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  fullWidth
                />
              </Box>
            )}
          </Stack>
        )}

        {canStart && (
          <Box mt={4} display="flex" justifyContent="center">
            <PixelButton
              borderColor="#969696"
              hoverBackground="#898989"
              hoverColor="#000"
              backgroundColor="#cacaca"
              color="#000"
              onClick={() => {
                initRound();
                setStep(ConurbanoGameStepsEnums);
              }}
            >
              ¡COMENZAR!
            </PixelButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PlayerSelectionScreen;
