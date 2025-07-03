// src/pages/TermoNeitor.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography, styled } from "@mui/material";
import "./TermoNeitor.css";
import {
  aguaItem,
  arrowDivider,
  azucarItem,
  bombillaIcon,
  cafeIcon,
  failGameSound,
  gauchoBack,
  termoImg,
  yerbaIcon,
  yuyoItem,
} from "../assets";
import { TermoNeitorStepsEnums } from "../enums/termoNeitorEnums";
import PixelButton from "../components/PixelButton/PixelButton";
import { backgroundThemeSrc } from "../assets/sounds";
import RhythmGame from "../components/RythmGame";
import PixelModal from "../components/Modals/PixelModal";
//import { useNavigate } from "react-router-dom";

const difficultyLevels = ["Fácil", "Normal", "Difícil"];

interface GameProps {
  onBack: () => void;
}

const FloatingItem = styled(Box)<{ delay: number }>(({ delay }) => ({
  width: 200,
  height: 200,
  backgroundColor: "#ddd",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "float 3s ease-in-out infinite",
  animationDelay: `${delay}s`,
  fontSize: 32,
  userSelect: "none",
  cursor: "pointer",

  "@keyframes float": {
    "0%": { transform: "translatey(0px)" },
    "50%": { transform: "translatey(-10px)" },
    "100%": { transform: "translatey(0px)" },
  },
}));

const TermoNeitor: React.FC<GameProps> = ({ onBack }) => {
  const [step, setStep] = useState<TermoNeitorStepsEnums>(
    TermoNeitorStepsEnums.START
  );

  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const failSoundRef = useRef(new Audio(failGameSound));

  useEffect(() => {
    musicRef.current = new Audio(backgroundThemeSrc);
    musicRef.current.loop = true;
    musicRef.current.volume = 0.1;
    musicRef.current.play();

    return () => {
      musicRef.current?.pause();
      musicRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (failureModalOpen || showErrorModal) {
      failSoundRef.current.play();
    }
  }, [failureModalOpen, showErrorModal]);

  const items = [
    { name: "Mate", image: termoImg },
    { name: "Bombilla", image: bombillaIcon },
    { name: "Yerba", image: yerbaIcon },
    { name: "Agua", image: aguaItem },
    { name: "Azúcar", image: azucarItem },
    { name: "Yuyos", image: yuyoItem },
    { name: "Café", image: cafeIcon },
  ];

  const filteredItems =
    difficulty === "Difícil"
      ? items
      : difficulty === "Normal"
      ? items.slice(0, 5)
      : items.slice(0, 4);

  const handleItemClick = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const correctOrders: Record<string, string[]> = {
    Fácil: ["Mate", "Bombilla", "Yerba", "Agua"],
    Normal: ["Mate", "Bombilla", "Yerba", "Azúcar", "Agua"],
    Difícil: ["Mate", "Bombilla", "Yuyos", "Yerba", "Azúcar", "Café", "Agua"],
  };

  const handleBackSteps = () => {
    if (step === TermoNeitorStepsEnums.DIFFICULTY) {
      setStep(TermoNeitorStepsEnums.START);
    } else if (step === TermoNeitorStepsEnums.SELECTION) {
      setStep(TermoNeitorStepsEnums.DIFFICULTY);
      setSelectedItems([]);
    } else if (step === TermoNeitorStepsEnums.RHYTHM) {
      setStep(TermoNeitorStepsEnums.SELECTION);
    }
  };

  const handleGameEnd = () => {
    setSelectedItems([]);
    setStep(TermoNeitorStepsEnums.START);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        backgroundImage: `url(${gauchoBack})`,
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
      {step !== TermoNeitorStepsEnums.START && (
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
      {step === TermoNeitorStepsEnums.START && (
        <>
          <Typography
            variant="h2"
            sx={{ color: "#fff" }}
            className="pixel-font text-outline"
          >
            ¡Bienvenido a Termo-Neitor!
          </Typography>
          <Box sx={{ mx: 50, textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{ color: "#fff" }}
              className="pixel-font text-outline"
            >
              En este juego debes primero poner los ingredientes en el orden
              correcto y luego completar el juego de ritmo para hacer un mate
              digno para el gaucho del futuro. ¡Pero ten cuidado! El agua esta a
              temperatura, no vaya a ser que se te enfríe!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 4 }}>
            <PixelButton
              onClick={() => setStep(TermoNeitorStepsEnums.DIFFICULTY)}
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
        </>
      )}

      {step === TermoNeitorStepsEnums.DIFFICULTY && (
        <>
          <Typography
            variant="h2"
            className="pixel-font text-outline"
            sx={{ color: "#fff", mb: 10 }}
          >
            Selecciona la dificultad
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {difficultyLevels.map((level) => (
              <PixelButton
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  setStep(TermoNeitorStepsEnums.SELECTION);
                }}
                backgroundColor="#2e7d32"
                hoverBackground="#1b5e20"
                borderColor="#1b5e20"
                color="#fff"
                hoverColor="#fff"
                width={200}
                height={50}
              >
                {level}
              </PixelButton>
            ))}
          </Box>
        </>
      )}

      {step === TermoNeitorStepsEnums.SELECTION && (
        <>
          <Typography variant="h4" className="pixel-font text-outline">
            Selecciona el orden de los ingredientes
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredItems.map((item, index) => (
              <FloatingItem
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                delay={(index % 5) * 0.3}
                sx={{ backgroundColor: "transparent" }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "70%",
                      height: "70%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography className="pixel-font" sx={{ fontSize: 10 }}>
                    {item.name}
                  </Typography>
                )}
              </FloatingItem>
            ))}
          </Box>
          <Box>
            <Typography className="pixel-font text-outline">
              Orden elegido:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {selectedItems.map((item, index) => (
                <React.Fragment key={item + index}>
                  <Typography className="pixel-font text-outline">
                    {item}
                  </Typography>
                  {index < selectedItems.length - 1 && (
                    <img
                      src={arrowDivider}
                      alt="→"
                      style={{ width: 20, height: 20, objectFit: "contain" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>
          {selectedItems.length === filteredItems.length && (
            <Stack gap={2}>
              <PixelButton
                onClick={() => {
                  const expectedOrder = correctOrders[difficulty || "Fácil"];
                  const isCorrect = selectedItems.every(
                    (item, i) => item === expectedOrder[i]
                  );

                  if (isCorrect) {
                    setStep(TermoNeitorStepsEnums.RHYTHM);
                  } else {
                    setFailureModalOpen(true);
                  }
                }}
                backgroundColor="#2e7d32"
                hoverBackground="#1b5e20"
                borderColor="#1b5e20"
                color="#fff"
                hoverColor="#fff"
                width={400}
                height={50}
              >
                Continuar al juego de ritmo
              </PixelButton>
              <PixelButton
                onClick={() => setSelectedItems([])}
                borderColor="#969696"
                hoverBackground="#898989"
                hoverColor="#000"
                color="#000"
              >
                Volver a seleccionar
              </PixelButton>
            </Stack>
          )}
        </>
      )}

      <PixelModal
        open={failureModalOpen}
        onClose={() => setFailureModalOpen(false)}
        title="¡Uy!"
        message="Con ese orden vas a tener que salir corriendo del gaucho del futuro y su facón sierra."
        buttonText="Volver a intentar"
      />

      {step === TermoNeitorStepsEnums.RHYTHM && (
        <>
          <RhythmGame
            difficulty={difficulty as "Fácil" | "Normal" | "Difícil"}
            onGameEnd={() => setShowSuccessModal(true)}
            onError={() => setShowErrorModal(true)}
          />
          <PixelModal
            open={showErrorModal}
            onClose={() => {
              setShowErrorModal(false);
              handleGameEnd();
            }}
            title="¡Ups!"
            message="Te equivocaste en el ritmo. ¡Intentá de nuevo!"
          />
          <PixelModal
            open={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              handleGameEnd();
            }}
            title="¡Buen mate!"
            message="Has preparado un mate digno del gaucho del futuro."
            buttonText="Volver al menú principal"
          />
        </>
      )}
    </Box>
  );
};

export default TermoNeitor;
