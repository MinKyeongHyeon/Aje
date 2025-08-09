import { useState, useEffect } from "react";
import "./App.css";
import ajeData from "./data/Aje.json";
import { smileGuyAscii } from "./components/AsciiArt.js";

function App() {
  const [currentJoke, setCurrentJoke] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // 애드센스 광고 로드 (배포 환경에서만)
  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

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

        <pre className="smile-guy">{smileGuyAscii}</pre>

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

        {/* 구글 애드센스 광고 */}
        <h3>구-글 애드센스 提供</h3>
        <div className="ad-container">
          {window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-여기에_귀하의_퍼블리셔_ID"
              data-ad-slot="여기에_광고_슬롯_ID"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          ) : (
            <div className="ad-placeholder">
              <p>🚧 개발 환경 - 광고 플레이스홀더 🚧</p>
              <p>실제 배포시 여기에 애드센스 광고가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
