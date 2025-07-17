// src/pages/ConurbanoGame.tsx
import React from "react";
import { Box, Typography, Stack, TextField } from "@mui/material";
import PixelButton from "../components/PixelButton/PixelButton";
import { ConurbanoGameStepsEnums } from "../enums/conurbanoGameEnums";
import { conurbanoBack, footballIcon, muteIcon, volumeIcon } from "../assets";
import LeafletMapSelector from "../components/LeafletMapSelector";
import { PlayerSelectBox } from "../components/PlayerSelectBox";
import PixelRankingTable from "../components/PixelRankingTable";
import PixelModal from "../components/Modals/PixelModal";
import { useConurbanoGameLogic } from "../hooks/useConurbanoGameLogic";
import { fultbolGames, playerGames } from "../constants/playerOptions";

declare global {
  interface Window {
    initStreetView: () => void;
    google: typeof google;
  }
}

interface GameProps {
  onBack: () => void;
}

const ConurbanoGame: React.FC<GameProps> = ({ onBack }) => {
  const {
    currentPlayerIndex,
    foundEasterEgg,
    getCurrentPlayerName,
    guessAddress,
    guessCoords,
    inputPlayersName,
    isFutbolMode,
    isLastRound,
    isMapLocked,
    isModalOpen,
    isMultiplayer,
    isMuted,
    maxRounds,
    nextRound,
    panoramaRef,
    player1,
    player2,
    polylineCoords,
    realCoords,
    resetGame,
    round,
    roundScore,
    saveRanking,
    selectedIndex,
    selectedPlayerCountIndex,
    setFoundEasterEgg,
    setGuessAddress,
    setGuessCoords,
    setInputPlayersName,
    setIsFutbolMode,
    setIsModalOpen,
    setIsMultiplayer,
    setIsMuted,
    setPlayer1,
    setPlayer2,
    setSelectedPlayerCountIndex,
    setStep,
    showRealMarker,
    startGame,
    step,
    ranking,
    calculateScore,
    lastDistanceKm,
  } = useConurbanoGameLogic();

  const handleSaveName = () => {
    if (isMultiplayer) {
      saveRanking(player1.name, player1.score);
      saveRanking(player2.name, player2.score);
    } else {
      saveRanking(player1.name, player1.score);
    }
  };

  const handleMapClick = async (coords: { lat: number; lng: number }) => {
    if (isMapLocked) return;
    setGuessCoords(coords);
    setGuessAddress(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
      );
      const data = await response.json();
      setGuessAddress(data.display_name || "Dirección no encontrada");
    } catch (e) {
      console.error(e);
      setGuessAddress("Dirección no encontrada");
    }
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
          <Stack alignItems="center" gap={2}>
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
                  setStep(ConurbanoGameStepsEnums.PLAYER_SELECT);
                }}
                variant="secondary"
              >
                EMPEZAR
              </PixelButton>

              <PixelButton onClick={onBack} variant="alert">
                VOLVER
              </PixelButton>
            </Box>
          </Stack>
        </>
      )}

      {step === ConurbanoGameStepsEnums.PLAYER_SELECT && (
        <Box>
          {foundEasterEgg && (
            <Typography
              variant="h5"
              sx={{ color: "#fff", textAlign: "center", mb: 2 }}
              className="pixel-font text-outline"
            >
              Modo Futbol: {isFutbolMode ? "ON" : "OFF"}
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
              {isFutbolMode ? (
                <>
                  {fultbolGames.map((x, i) => (
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
                </>
              ) : (
                <>
                  {playerGames.map((x, i) => (
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
                </>
              )}
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
                    slotProps={{ htmlInput: { maxLength: 16 } }}
                    value={player1.name}
                    onChange={(e) =>
                      setPlayer1((prev) => ({ ...prev, name: e.target.value }))
                    }
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
                      value={player2.name}
                      slotProps={{ htmlInput: { maxLength: 16 } }}
                      onChange={(e) =>
                        setPlayer2((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  </Box>
                )}
              </Stack>
            )}

            {inputPlayersName &&
              ((isMultiplayer &&
                player1.name.trim().length >= 3 &&
                player2.name.trim().length >= 3) ||
                (!isMultiplayer && player1.name.trim().length >= 3)) && (
                <Box mt={4} display="flex" justifyContent="center">
                  <PixelButton
                    variant="secondary"
                    onClick={() => {
                      startGame();
                      setStep(ConurbanoGameStepsEnums.ROUNDS);
                    }}
                  >
                    ¡COMENZAR!
                  </PixelButton>
                </Box>
              )}
          </Stack>
        </Box>
      )}

      {step === ConurbanoGameStepsEnums.ROUNDS && (
        <Stack alignContent={"center"} alignItems={"center"} gap={2}>
          <Typography
            variant="h4"
            gutterBottom
            className="pixel-font text-outline"
          >
            Descubriendo el Conurbano - Ronda {round}/{maxRounds}
          </Typography>

          {round !== 0 && (
            <Typography
              className="pixel-font text-outline"
              sx={{ color: "#fff", mb: 2 }}
            >
              Turno de: {getCurrentPlayerName()}
            </Typography>
          )}

          {round === 0 && (
            <PixelButton
              variant="action"
              width={400}
              height={50}
              onClick={startGame}
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
              <Stack mt={4} spacing={2} width={"50%"} alignSelf={"center"}>
                <Typography className="pixel-font text-outline">
                  {guessAddress
                    ? `Tu elección: ${guessAddress}`
                    : `lat ${guessCoords.lat.toFixed(
                        4
                      )}, lng ${guessCoords.lng.toFixed(4)}`}
                </Typography>

                <PixelButton variant="secondary" onClick={calculateScore}>
                  Enviar Adivinanza
                </PixelButton>
              </Stack>
            )}
          </Stack>
          {lastDistanceKm !== null && (
            <Typography
              className="pixel-font text-outline"
              sx={{ color: "#fff", my: 2 }}
            >
              Estuviste a {lastDistanceKm.toFixed(2)} km del lugar correcto.
            </Typography>
          )}
          {roundScore !== null && (
            <PixelButton
              variant="primary"
              sx={{ my: 2 }}
              onClick={() => {
                if (isLastRound()) {
                  setStep(ConurbanoGameStepsEnums.RANKING);
                } else {
                  nextRound();
                }
              }}
            >
              {isLastRound() ? "Ver Puntajes" : "Siguiente Ronda"}
            </PixelButton>
          )}
        </Stack>
      )}

      {roundScore !== null && step === ConurbanoGameStepsEnums.RANKING && (
        <Stack gap={5}>
          {isMultiplayer ? (
            <>
              <Typography variant="h6" className="pixel-font text-outline">
                Puntaje de {player1.name}: {player1.score} / {maxRounds * 1000}
              </Typography>
              <Typography variant="h6" className="pixel-font text-outline">
                Puntaje de {player2.name}: {player1.score} / {maxRounds * 1000}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" className="pixel-font text-outline">
              Puntaje total: {player1.score} / {maxRounds * 1000}
            </Typography>
          )}
          <PixelButton
            variant="primary"
            onClick={handleSaveName}
            disabled={
              !player1.name.trim() || (isMultiplayer && !player2.name.trim())
            }
          >
            Guardar en el Ranking
          </PixelButton>
        </Stack>
      )}

      {step === ConurbanoGameStepsEnums.PLAYER_SELECT && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 999,
            cursor: "pointer",
            filter: isFutbolMode ? "none" : "grayscale(100%) brightness(0.4)",
          }}
          onClick={() => {
            if (!foundEasterEgg) {
              setIsModalOpen(true);
            }
            setIsFutbolMode(!isFutbolMode);
          }}
        >
          <img
            src={footballIcon}
            alt={"Modo Futbol"}
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 999,
          cursor: "pointer",
        }}
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <img
            src={muteIcon}
            alt={"Mute"}
            style={{
              width: "75%",
              height: 100,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          <img
            src={volumeIcon}
            alt={"Volume on"}
            style={{
              width: "75%",
              height: 100,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        )}
      </Box>

      {step === ConurbanoGameStepsEnums.ROUNDS && (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 20,
              right: -10,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "#1565c0",
              padding: 2,
              borderRadius: 2,
              border: "2px solid #0d4380",
            }}
          >
            <Typography
              variant="body2"
              className="pixel-font"
              sx={{ color: "#fff", textAlign: "center" }}
            >
              {player1.name}: {player1.score}
            </Typography>
          </Box>
          {isMultiplayer && (
            <Box
              sx={{
                position: "fixed",
                top: 80,
                right: -10,
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                backgroundColor: "#1565c0",
                padding: 2,
                borderRadius: 2,
                border: "2px solid #0d4380",
              }}
            >
              <Typography
                variant="body2"
                className="pixel-font"
                sx={{ color: "#fff", textAlign: "center" }}
              >
                {player2.name}: {player2.score}
              </Typography>
            </Box>
          )}
        </>
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
          <PixelButton onClick={resetGame} variant="alert">
            VOLVER
          </PixelButton>
        </Box>
      )}

      <PixelModal
        open={isModalOpen}
        onClose={() => {
          setFoundEasterEgg(true);
          setIsModalOpen(false);
        }}
        title="¡Excelente!"
        message="Encontraste el modo futbol y ahora gracias a eso, podrás elegir si conocer las calles o los estadios del Futbol Argentino."
        buttonText="Continuar"
      />

      {step === ConurbanoGameStepsEnums.RANKING && (
        <>{ranking.length > 0 && <PixelRankingTable ranking={ranking} />}</>
      )}
    </Box>
  );
};

export default ConurbanoGame;
