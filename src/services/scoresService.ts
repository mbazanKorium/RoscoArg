// src/services/scores.ts
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { RankingEntry } from "../dto/conurbanoGamesDto.dto";

export const addScore = async (entry: RankingEntry) => {
  const fecha = new Date();
  await addDoc(collection(db, "scores"), {
    nombre: entry.name,
    puntaje: entry.score,
    fecha: fecha.toISOString()
  });
};

export const getScores = async () : Promise<RankingEntry[]> => {
  const scoresCollection = collection(db, "scores");
  const scoresSnapshot = await getDocs(scoresCollection);
  const scoresList = scoresSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.nombre,
      score: data.puntaje,
      fecha: data.fecha
    } as RankingEntry;
  });
  return scoresList;
};
