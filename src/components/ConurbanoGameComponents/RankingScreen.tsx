// src/components/ConurbanoGame/RankingScreen.tsx
import React from "react";
import { Stack, Typography } from "@mui/material";
import PixelButton from "../PixelButton/PixelButton";
import PixelRankingTable from "../PixelRankingTable";

interface Props {
  totalScore: number;
  maxRounds: number;
  player1Name: string;
  player2Name: string;
  isMultiplayer: boolean;
  handleSaveName: () => void;
  ranking: { name: string; score: number }[];
}

const RankingScreen: React.FC<Props> = ({
  totalScore,
  maxRounds,
  player1Name,
  player2Name,
  isMultiplayer,
  handleSaveName,
  ranking,
}) => {
  return (
    <Stack gap={5} alignItems="center">
      <Typography variant="h6" className="pixel-font text-outline">
        Puntaje total: {totalScore} / {maxRounds * 1000}
      </Typography>

      <PixelButton
        borderColor="#1979e6"
        hoverBackground="#0d4380"
        backgroundColor="#1565c0"
        hoverColor="#FFF"
        color="#FFF"
        onClick={handleSaveName}
        disabled={!player1Name.trim() || (isMultiplayer && !player2Name.trim())}
      >
        Guardar en el Ranking
      </PixelButton>

      {ranking.length > 0 && <PixelRankingTable ranking={ranking} />}
    </Stack>
  );
};

export default RankingScreen;
