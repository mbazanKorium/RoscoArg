// This is the cleaned and optimized version of `useConurbanoGameLogic.ts`.
// All core logic is separated for better reuse in your `ConurbanoGame.tsx`.

import { useEffect, useRef, useState } from "react";
import { ConurbanoGameStepsEnums, GameplayModeEnums } from "../enums/conurbanoGameEnums";
import { conurbanoGameThemSrc } from "../assets/sounds";
import {
  FOOTBALL_LOCATIONS,
  CONURBANO_LOCATIONS,
  MONUMENT_LOCATIONS,
} from "../constants/locations";
import { waitForGoogleMaps } from "../utils/waitForGoogle";
import { RankingEntry } from "../dto/conurbanoGamesDto.dto";
import { getConurbanoScore } from "../utils/getConurbanoScore";

export const useConurbanoGameLogic = () => {
  const [step, setStep] = useState(ConurbanoGameStepsEnums.START);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [ranking, setRanking] = useState<{ name: string; score: number }[]>([]);

  const [player1, setPlayer1] = useState<RankingEntry>({ name: "", score: 0 });
  const [player2, setPlayer2] = useState<RankingEntry>({ name: "", score: 0 });
  const [usedIndices, setUsedIndices] = useState<number[][]>([[], []]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<0 | 1 | null>(
    null
  );
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  const [gameLocations, setGameLocations] = useState(CONURBANO_LOCATIONS);
  const [isFutbolMode, setIsFutbolMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameplayModeEnums>(GameplayModeEnums.NORMAL);
  const [previousGameMode, setPreviousGameMode] = useState<GameplayModeEnums | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastDistanceKm, setLastDistanceKm] = useState<number | null>(null);
  const [hasDoneRushThisRound, setHasDoneRushThisRound] = useState(false);


  const [realCoords, setRealCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [guessCoords, setGuessCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [guessAddress, setGuessAddress] = useState<string | null>(null);
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [polylineCoords, setPolylineCoords] = useState<Array<[number, number]>>(
    []
  );
  const [showRealMarker, setShowRealMarker] = useState(false);

  const [isMapLocked, setIsMapLocked] = useState(false);
  const [selectedPlayerCountIndex, setSelectedPlayerCountIndex] = useState<
    number | null
  >(null);
  const [inputPlayersName, setInputPlayersName] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundEasterEgg, setFoundEasterEgg] = useState(false);

  const maxRounds = 5;

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("conurbano-ranking");
    if (stored) setRanking(JSON.parse(stored));
  }, []);

  useEffect(() => {
    musicRef.current = new Audio(conurbanoGameThemSrc);
    musicRef.current.loop = true;
    musicRef.current.play();
    return () => musicRef.current?.pause();
  }, []);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = isMuted ? 0 : 0.2;
  }, [isMuted]);

  const saveRanking = (name: string, score: number) => {
    const newRanking = [...ranking, { name, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setRanking(newRanking);
    localStorage.setItem("conurbano-ranking", JSON.stringify(newRanking));
  };

  const initRound = (locations = gameLocations) => {
    const index = Math.floor(Math.random() * locations.length);
    const location = locations[index];
    setSelectedIndex(index);
    setRealCoords(location);
    setGuessCoords(null);
    setRoundScore(null);
    setPolylineCoords([]);
    setGuessAddress(null);
    setIsMapLocked(false);
    setShowRealMarker(false);
    setLastDistanceKm(null);

    waitForGoogleMaps().then(async (google) => {
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
        if (!e.latLng) return;
        const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setGuessCoords(position);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
          setGuessAddress(
            (status === "OK" && results?.[0]?.formatted_address) ||
            "Dirección no encontrada"
          );
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
      });
    });
    const nextIndex = () => {
      const used = usedIndices[currentPlayerIndex ?? 0];
      const available = gameLocations
        .map((_, i) => i)
        .filter((i) => !used.includes(i));

      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    };

    const newindex = nextIndex();
    if (newindex === null) return;

    setSelectedIndex(newindex);
    setUsedIndices((prev) => {
      const copy = [...prev];
      copy[currentPlayerIndex ?? 0] = [
        ...copy[currentPlayerIndex ?? 0],
        newindex,
      ];
      return copy;
    });
  };

  const calculateScore = () => {
    if (!guessCoords || !realCoords) return;
    const { score, distance } = getConurbanoScore(realCoords, guessCoords);

    setRoundScore(score);
    setLastDistanceKm(distance);

    if (isMultiplayer) {
      if (currentPlayerIndex === 0) {
        setPlayer1((prev) => ({ ...prev, score: prev.score + score }));
      } else {
        setPlayer2((prev) => ({ ...prev, score: prev.score + score }));
      }
    } else {
      setPlayer1((prev) => ({ ...prev, score: prev.score + score }));
    }

    setPolylineCoords([
      [realCoords.lat, realCoords.lng],
      [guessCoords.lat, guessCoords.lng],
    ]);
    setIsMapLocked(true);
    setShowRealMarker(true);
  };

  const isLastRound = () =>
    isMultiplayer
      ? round === maxRounds && currentPlayerIndex === 1
      : round === maxRounds;

  const nextRound = () => {
    if (isMultiplayer) {
      if (currentPlayerIndex === 0) {
        setCurrentPlayerIndex(1);
      } else {
        setCurrentPlayerIndex(0);
        setRound((r) => r + 1);
        setHasDoneRushThisRound(false);
      }
    } else {
      setRound((r) => r + 1);
      setHasDoneRushThisRound(false);
    }
    initRound();
  };


  const startGame = () => {
    setRound(1);
    setTotalScore(0);
    setCurrentPlayerIndex(0);
    const selected =
      gameMode === GameplayModeEnums.FUTBOL
        ? FOOTBALL_LOCATIONS
        : gameMode === GameplayModeEnums.MONUMENTOS
          ? MONUMENT_LOCATIONS
          : CONURBANO_LOCATIONS;
    setGameLocations(selected);
    initRound(selected);
  };

  const resetGame = () => {
    setStep(ConurbanoGameStepsEnums.START);
    setGuessCoords(null);
    setPolylineCoords([]);
    setCurrentPlayerIndex(null);
    setSelectedPlayerCountIndex(null);
    setIsMapLocked(false);
    setIsMultiplayer(false);
    setPlayer1({ name: "", score: 0 });
    setPlayer2({ name: "", score: 0 });
    setInputPlayersName(false);
    setUsedIndices([[], []]);
    startGame();
  };

  const toggleFutbolMode = () => {
    setIsFutbolMode((prev) => {
      const isActivating = !prev;

      if (isActivating) {
        setPreviousGameMode(gameMode);
        setGameMode(GameplayModeEnums.FUTBOL);
      } else {
        if (previousGameMode) {
          setGameMode(previousGameMode);
          setPreviousGameMode(null);
        }
      }

      return !prev;
    });
  };


  return {
    step,
    setStep,
    round,
    maxRounds,
    totalScore,
    setTotalScore,
    player1,
    setPlayer1,
    player2,
    setPlayer2,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    isMultiplayer,
    setIsMultiplayer,
    setRoundScore,
    setPolylineCoords,
    setIsMapLocked,
    setShowRealMarker,
    setRound,
    ranking,
    gameMode,
    setGameMode,
    isFutbolMode,
    setIsFutbolMode,
    selectedIndex,
    setSelectedIndex,
    selectedPlayerCountIndex,
    setSelectedPlayerCountIndex,
    inputPlayersName,
    setInputPlayersName,
    isMuted,
    setIsMuted,
    setGuessCoords,
    setGuessAddress,
    isModalOpen,
    setIsModalOpen,
    foundEasterEgg,
    setFoundEasterEgg,
    panoramaRef,
    mapRef,
    setGameLocations,
    guessCoords,
    guessAddress,
    roundScore,
    realCoords,
    polylineCoords,
    showRealMarker,
    isMapLocked,
    initRound,
    calculateScore,
    isLastRound,
    nextRound,
    startGame,
    resetGame,
    lastDistanceKm,
    saveRanking,
    toggleFutbolMode,
    previousGameMode,
    hasDoneRushThisRound,
    setHasDoneRushThisRound,
    getCurrentPlayerName: () =>
      !isMultiplayer
        ? player1.name
        : currentPlayerIndex === 0
          ? player1.name
          : player2.name,
  };
};
