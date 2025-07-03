import React, { useState } from "react";
import { Box, Typography, Stack, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PixelButton from "../components/PixelButton/PixelButton";
import { termoImg, roscoImg, conurbanoImg } from "../assets";

interface GameOptionType {
  label: string;
  image: string;
  route: string;
  description: string;
}

const gameOptions: GameOptionType[] = [
  {
    label: "Termo-Neitor",
    image: termoImg,
    route: "/termo-neitor",
    description:
      "En este juego deberas elegir ingredientes en el orden correcto y terminar el juego de ritmo antes que se termine el tiempo!",
  },
  {
    label: "Rosco del Lunfardo",
    image: roscoImg,
    route: "/rosco",
    description:
      "Medi tu conocimiento y juga el clasico rosco con palabras del lunfardo argentino.",
  },
  {
    label: "Descubriendo el conurbano",
    image: conurbanoImg,
    route: "/conurbano",
    description:
      "Explora el conurbano bonaerense tratando de adivinar donde te encontras.",
  },
];

const Home: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#a5c8f6",
        gap: 4,
        fontFamily: "'Irish Grover', cursive",
      }}
    >
      {selectedIndex !== null && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
          onClick={() => setSelectedIndex(null)}
        />
      )}

      <Stack gap={10} alignItems={"center"}>
        {selectedIndex === null && (
          <Typography
            variant="h5"
            sx={{ color: "#fff", textAlign: "center", mx: 10 }}
            className="pixel-font text-outline"
          >
            Bienvenido a Juegos Argentinos, el lugar donde vas a encontrar
            multiples juegos para distraerte de la manera más patriota que
            existe!
          </Typography>
        )}

        <Stack direction={"row"} gap={10}>
          {gameOptions.map((game, index) => {
            const isSelected = selectedIndex === index;

            return (
              <Box
                key={index}
                sx={{
                  width: isSelected ? 800 : 400,
                  height: isSelected ? 800 : 560,
                  backgroundColor: "#b3e5fc",
                  borderRadius: 4,
                  boxShadow: 4,
                  zIndex: isSelected ? 2 : 0,
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  px: 4,
                  py: isSelected ? 6 : 2,
                }}
                onClick={() => {
                  if (!isSelected) setSelectedIndex(index);
                }}
              >
                {isSelected ? (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="h4"
                        sx={{ textAlign: "center", color: "#fff", mt: 2 }}
                        className="pixel-font text-outline"
                      >
                        {game.label}
                      </Typography>
                      <img
                        src={game.image}
                        alt={game.label}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                        }}
                      />
                    </Stack>

                    <Fade in={isSelected} unmountOnExit>
                      <Stack
                        spacing={4}
                        sx={{ mt: 4, textAlign: "center", px: 4 }}
                      >
                        <Typography
                          className="pixel-font text-outline"
                          sx={{
                            textAlign: "center",
                            color: "#fff",
                            textTransform: "uppercase",
                          }}
                        >
                          {game.description}
                        </Typography>
                        <PixelButton
                          borderColor="#969696"
                          hoverBackground="#898989"
                          backgroundColor="#cacaca"
                          hoverColor="#000"
                          color="#000"
                          onClick={() => navigate(game.route)}
                        >
                          COMENZAR
                        </PixelButton>
                      </Stack>
                    </Fade>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", color: "#fff" }}
                      className="pixel-font text-outline"
                    >
                      {game.label}
                    </Typography>
                    <img
                      src={game.image}
                      alt={game.label}
                      style={{
                        width: 200,
                        height: 200,
                        transition: "all 0.3s ease",
                      }}
                    />
                  </>
                )}
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
