# RoscoArg

**Repositorio:** [https://github.com/mbazanKorium/RoscoArg](https://github.com/mbazanKorium/RoscoArg)

## Introducción

RoscoArg es un juego web que permite a los usuarios realizar una ronda de palabras parecida al formato de juego “Rosco”, con la particularidad de que las preguntas son propias del lunfardo argentino.

---

## Core Values

- **Identidad cultural**: Celebramos el lunfardo y el habla popular argentina, promoviendo el aprendizaje a través del juego.
- **Accesibilidad y diversión**: Queremos que cualquier persona, sin importar edad o nivel educativo, pueda disfrutar y aprender.
- **Aprendizaje lúdico**: Combinamos entretenimiento con conocimiento, fomentando la curiosidad y el vocabulario.

---

## Fantasía

RoscoArg transporta a los jugadores a una competencia de palabras ambientada en una versión caricaturesca de la Argentina urbana, donde cada letra del abecedario revela una palabra típica del lunfardo. El jugador se convierte en un "sabiondo del barrio", tratando de completar el rosco antes que se agote el tiempo, enfrentando pistas con picardía porteña.

---

## Gameplay Pillars

- **Desafío progresivo**: Las palabras y pistas se generan con niveles de dificultad escalables.
- **Rejugabilidad**: Gracias a la integración con OpenAI, las palabras y pistas pueden ser distintas en cada partida.
- **Estética y claridad**: Un diseño claro e intuitivo que favorece la experiencia de juego, incluso en dispositivos móviles.
- **Inmediatez**: Cada ronda es corta, dinámica, y mantiene la tensión hasta el final.

---

## Notas Técnicas

- **Stack Tecnológico**: El juego está desarrollado utilizando **React + TypeScript + Material UI**.
  - *Justificación*: React permite construir una UI modular y reactiva ideal para juegos web; TypeScript ayuda a reducir errores y facilita el escalado del proyecto; y Material UI brinda componentes visuales modernos y accesibles sin comprometer la personalización.

- **Persistencia de datos**: Se utilizará **Firebase** como base de datos para almacenar palabras, pistas y estadísticas de usuario en el futuro.
  - *Justificación*: Firebase permite un backend serverless y de fácil integración con frontends en React, ideal para MVPs y escalamiento progresivo.

- **Generación de contenido dinámica**: En esta primera versión (MVP), las palabras y pistas son generadas en tiempo real mediante una **integración con OpenAI**, lo que permite contenido variado y coherente sin una base de datos inicial extensa.

