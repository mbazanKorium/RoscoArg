import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useLunfardoWords } from './hooks/useLunfardoWords'

function App() {
  const { words, loading, error, fetchWords } = useLunfardoWords();

  const handleFetchWords = async () => {
    await fetchWords();
    console.log(words);
  };

  if (loading) return <p>Cargando...</p>

  if (error) return <p>Error: {error}</p>

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
      <button onClick={handleFetchWords}>Generar Rosco</button>
        <ul>
          {words?.data?.map((word, index) => (
            <li key={index}>
              {word.letter}: {word.word} - {word.description}
            </li>
          ))}
        </ul>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
