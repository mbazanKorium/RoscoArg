import OpenAI from 'openai';
import { AIWordResponse } from '../models/AIWord';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true , // evita exponer la key en el frontend
});

/**
 * Genera un rosco completo con palabras de lunfardo.
 * @param letters Array de letras a generar (por defecto alfabeto español).
 */
export async function generateLunfardoWords(letters: string[] = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z',
]): Promise<AIWordResponse> {
  const prompt = `
  Devuelve **solo** un array JSON, llamado **data** (no un objeto) con elementos {letter, word, description, booleano (startsWithLetter) para indicar si la palabra empieza con esa letra o si la contiene} donde cada palabra pertenece al lunfardo argentino y comienza (o contiene) la letra indicada.
  Cada letra debe tener una palabra diferente. La descripción debe ser breve y en español.
  No puede haber palabras repetidas.
  Todas letras deben tener una palabra.
  No envíes nada más que el JSON.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un asistente experto en lunfardo porteño.' },
      { role: 'user', content: `${prompt}
Letras: ${letters.join(',')}` },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });
  const json = completion.choices[0].message.content;
  if (!json) {
    throw new Error('No se recibió respuesta válida de OpenAI.');
  }
  // Verifica si el JSON es válido
  return JSON.parse(json) as AIWordResponse;
}
