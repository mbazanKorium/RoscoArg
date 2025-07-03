// src/pages/ConurbanoGame.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Stack, TextField } from "@mui/material";
import { waitForGoogleMaps } from "../utils/waitForGoogle";
import PixelButton from "../components/PixelButton/PixelButton";
import { ConurbanoGameStepsEnums } from "../enums/conurbanoGameEnums";
import { conurbanoBack, modalBackground } from "../assets";
import { conurbanoGameThemSrc } from "../assets/sounds";

const CONURBANO_LOCATIONS = [
  { lat: -34.6037, lng: -58.3816 },
  { lat: -34.6596, lng: -58.468 },
  { lat: -34.6759, lng: -58.5382 },
  { lat: -34.534, lng: -58.7006 },
  { lat: -34.6525, lng: -58.6202 },
];

declare global {
  interface Window {
    initStreetView: () => void;
    google: typeof google;
  }
}

interface RankingEntry {
  name: string;
  score: number;
}

interface GameProps {
  onBack: () => void;
}

const ConurbanoGame: React.FC<GameProps> = ({ onBack }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [maxRounds] = useState(5);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [guessCoords, setGuessCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [guessAddress, setGuessAddress] = useState<string | null>(null);
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [step, setStep] = useState<ConurbanoGameStepsEnums>(
    ConurbanoGameStepsEnums.START
  );

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const lineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("conurbano-ranking");
    if (stored) setRanking(JSON.parse(stored));
  }, []);

  useEffect(() => {
    musicRef.current = new Audio(conurbanoGameThemSrc);
    musicRef.current.loop = true;
    musicRef.current.volume = 0.1;
    musicRef.current.play();

    return () => {
      musicRef.current?.pause();
      musicRef.current = null;
    };
  }, []);

  const saveRanking = (name: string, score: number) => {
    const newRanking = [...ranking, { name, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setRanking(newRanking);
    localStorage.setItem("conurbano-ranking", JSON.stringify(newRanking));
  };

  const initRound = () => {
    const index = Math.floor(Math.random() * CONURBANO_LOCATIONS.length);
    setSelectedIndex(index);
    setGuessCoords(null);
    setRoundScore(null);

    waitForGoogleMaps().then(async (google) => {
      const location = CONURBANO_LOCATIONS[index];

      new google.maps.StreetViewPanorama(panoramaRef.current!, {
        position: location,
        pov: { heading: 100, pitch: 0 },
        zoom: 1,
        addressControl: false,
        fullscreenControl: false,
      });

      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: -34.6, lng: -58.5 },
        zoom: 10,
      });

      mapInstanceRef.current = map;

      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          setGuessCoords(position);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setGuessAddress(address);
            } else {
              setGuessAddress("Dirección no encontrada");
            }
          });

          if (markerRef.current) markerRef.current.map = null;
          const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"
          )) as google.maps.MarkerLibrary;

          markerRef.current = new AdvancedMarkerElement({
            position,
            map,
            title: "Tu elección",
          });
        }
      });
    });
  };

  const handleBackSteps = () => {
    if (step === ConurbanoGameStepsEnums.ROUNDS) {
      setStep(ConurbanoGameStepsEnums.START);
      setGuessCoords(null);
      handleGameStart();
    } else if (step === ConurbanoGameStepsEnums.TABLE) {
      setStep(ConurbanoGameStepsEnums.START);
      setGuessCoords(null);
      handleGameStart();
    } else if (step === ConurbanoGameStepsEnums.RANKING) {
      setStep(ConurbanoGameStepsEnums.START);
      setGuessCoords(null);
      handleGameStart();
    }
  };

  const handleSubmitGuess = () => {
    if (!guessCoords || selectedIndex === null || !mapInstanceRef.current)
      return;

    const google = window.google;
    const real = CONURBANO_LOCATIONS[selectedIndex];

    const R = 6371;
    const dLat = ((guessCoords.lat - real.lat) * Math.PI) / 180;
    const dLng = ((guessCoords.lng - real.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((real.lat * Math.PI) / 180) *
        Math.cos((guessCoords.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const maxDistance = 50;
    const calculatedScore = Math.max(
      0,
      Math.round(1000 - (distance / maxDistance) * 1000)
    );
    setRoundScore(calculatedScore);
    setTotalScore((prev) => prev + calculatedScore);

    const map = mapInstanceRef.current;
    if (lineRef.current) lineRef.current.setMap(null);
    lineRef.current = new google.maps.Polyline({
      path: [real, guessCoords],
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map,
    });
  };

  const nextRound = () => {
    if (currentRound >= maxRounds) return;
    setCurrentRound((r) => r + 1);
    initRound();
  };

  const handleGameStart = () => {
    setTotalScore(0);
    setCurrentRound(1);
    initRound();
  };

  const handleSaveName = () => {
    saveRanking(playerName, totalScore);
    setPlayerName("");
  };

  return (
    <Box
      p={4}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        backgroundImage: `url(${conurbanoBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      {step === ConurbanoGameStepsEnums.START && (
        <>
          <Stack alignContent={"center"} alignItems={"center"} gap={2}>
            <Typography
              variant="h4"
              sx={{ color: "#fff" }}
              className="pixel-font text-outline"
            >
              Bienvenido a
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: "#fff" }}
              className="pixel-font text-outline"
            >
              ¡Descubriendo El Conurbano!
            </Typography>
            <Box sx={{ mx: 50, textAlign: "center", my: 4 }}>
              <Typography
                variant="body1"
                sx={{ color: "#fff" }}
                className="pixel-font text-outline"
              >
                En este juego debes adivinar en que lugar del conurbano
                bonaerense te encuentras, tendras que reconocer todo tipo de
                señales, ya sean nombres de calle, edificios y quien te dice
                quizas algun arbol!
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 4 }}>
              <PixelButton
                onClick={() => {
                  setStep(ConurbanoGameStepsEnums.ROUNDS);
                  initRound();
                }}
                borderColor="#969696"
                hoverBackground="#898989"
                hoverColor="#000"
                color="#000"
              >
                EMPEZAR
              </PixelButton>

              <PixelButton
                onClick={onBack}
                borderColor="#000"
                hoverColor="#f00"
                backgroundColor="#f00"
                hoverBackground="#b30000"
                color="#fff"
              >
                VOLVER
              </PixelButton>
            </Box>
          </Stack>
        </>
      )}

      {step === ConurbanoGameStepsEnums.ROUNDS && (
        <Stack alignContent={"center"} alignItems={"center"} gap={2}>
          <Typography
            variant="h4"
            gutterBottom
            className="pixel-font text-outline"
          >
            Descubriendo el Conurbano - Ronda {currentRound}/{maxRounds}
          </Typography>

          {currentRound === 0 && (
            <PixelButton
              backgroundColor="#2e7d32"
              hoverBackground="#1b5e20"
              borderColor="#1b5e20"
              color="#fff"
              hoverColor="#fff"
              width={400}
              height={50}
              onClick={handleGameStart}
              disabled={selectedIndex !== null}
            >
              Iniciar Juego
            </PixelButton>
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
              ref={mapRef}
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
            />
          </Stack>

          <Stack>
            {guessCoords && roundScore === null && (
              <Stack mt={4} spacing={2} width={"50%"} alignSelf={"center"}>
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
          {currentRound < maxRounds && (
            <PixelButton
              borderColor="#1979e6"
              hoverBackground="#0d4380"
              backgroundColor="#1565c0"
              hoverColor="#FFF"
              color="#FFF"
              onClick={nextRound}
            >
              Siguiente Ronda
            </PixelButton>
          )}
        </Stack>
      )}

      {step === ConurbanoGameStepsEnums.TABLE && (
        <Stack>
          {roundScore !== null && (
            <Stack mt={4} spacing={2}>
              <Typography>Puntaje de ronda: {roundScore} / 1000</Typography>
              <Button variant="contained" onClick={nextRound}>
                Siguiente Ronda
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      {roundScore !== null && step === ConurbanoGameStepsEnums.RANKING && (
        <Stack>
          <Typography>Puntaje de ronda: {roundScore} / 1000</Typography>
          <Typography variant="h6">
            Puntaje total: {totalScore} / {maxRounds * 1000}
          </Typography>
          <Box
            width={400}
            height={60}
            sx={{
              display: "flex",
              backgroundImage: `url(${modalBackground})`,
              backgroundSize: "300px 44px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              value={playerName}
              variant="standard"
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </Box>

          <PixelButton
            borderColor="#1979e6"
            hoverBackground="#0d4380"
            backgroundColor="#1565c0"
            hoverColor="#FFF"
            color="#FFF"
            onClick={handleSaveName}
            disabled={!playerName.trim()}
          >
            Guardar en el Ranking
          </PixelButton>
        </Stack>
      )}

      {step !== ConurbanoGameStepsEnums.START && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 999,
          }}
        >
          <PixelButton
            onClick={handleBackSteps}
            backgroundColor="#f00"
            hoverBackground="#b30000"
            borderColor="#000"
            color="#fff"
            hoverColor="#fff"
          >
            VOLVER
          </PixelButton>
        </Box>
      )}

      {step === ConurbanoGameStepsEnums.RANKING && (
        <>
          {ranking.length > 0 && (
            <Box mt={6}>
              <Typography variant="h5">Ranking</Typography>
              <Stack spacing={1} mt={2}>
                {ranking.map((entry, i) => (
                  <Typography key={i}>
                    {i + 1}. {entry.name} - {entry.score} pts
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ConurbanoGame;
