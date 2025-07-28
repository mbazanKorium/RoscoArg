export interface RankingEntry {
  name: string;
  score: number;
}

export interface LocationEntry {
  lat: number;
  lng: number;
}

export interface Question {
  question: string;
  answer: boolean;
}
