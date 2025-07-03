export interface AIWord {
    letter: string;      // "A", "B", "C", "Ñ", etc.
    word: string;        // "bondiola"
    description: string; // "Carne de cerdo..."
    startsWithLetter: boolean; // true o false
  }

  export interface AIWordResponse {
    data: AIWord[]; // Array de palabras generadas
  }