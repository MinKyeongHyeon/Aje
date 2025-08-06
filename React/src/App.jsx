import { useState } from "react";
import "./App.css";
import ajeData from "./data/Aje.json";

function App() {
  const [currentJoke, setCurrentJoke] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  function getRandomJoke() {
    const randomIndex = Math.floor(Math.random() * ajeData.length);
    setCurrentJoke(ajeData[randomIndex]);
    setShowAnswer(false);
  }

  function showAnswerHandler() {
    setShowAnswer(true);
  }

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">모자람 없어도... 재미는 있으니까...</h1>
        <p className="app-subtitle">웃으면 너도 아저씨</p>

        <button onClick={getRandomJoke} className="random-button">
          개그 감상하기
        </button>

        {currentJoke && (
          <div className="joke-container">
            <h2 className="question">Q: {currentJoke.question}</h2>

            {!showAnswer ? (
              <button onClick={showAnswerHandler} className="answer-button">
                정답 보기
              </button>
            ) : (
              <div className="answer-container">
                <h3 className="answer">A: {currentJoke.answer} ㅋㅋ</h3>
              </div>
            )}
          </div>
        )}

        <p className="joke-count">
          총 {ajeData.length}개의 아재개그가 수록되어있는 모음-집
        </p>
      </div>
    </>
  );
}

export default App;
