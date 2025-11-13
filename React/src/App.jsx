import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import clickSfx from "./assets/sfx/click.mp3";
import ajeData from "./data/Aje.json";
import { useJokes } from "./hooks/useJokes";
import JokeCard from "./components/JokeCard.jsx";
import { SMILE_ASCII_ART } from "./constants/asciiArt";

function App() {
  const [asciiHovered, setAsciiHovered] = useState(false);
  // 클릭 디바운싱 / UX 개선을 위한 상태
  const [randomDisabled, setRandomDisabled] = useState(false);
  const [answerDisabled, setAnswerDisabled] = useState(false);
  const [voteDisabledIds, setVoteDisabledIds] = useState({});
  const [notice, setNotice] = useState("");
  const [terminalMode, setTerminalMode] = useState(false);

  // 아재개그 훅 사용
  const {
    currentJoke,
    showAnswer,
    isLoading,
    error,
    getRandomJoke,
    showAnswerHandler,
    resetJoke,
  } = useJokes(ajeData);

  // 좋아요/싫어요 상태는 로컬스토리지에 저장
  const [votes, setVotes] = useState(() => {
    try {
      const raw = localStorage.getItem("jokeVotes");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const handleLike = useCallback(
    (jokeId) => {
      if (voteDisabledIds[jokeId]) {
        setNotice("잠시만요 — 버튼이 너무 빠르게 눌렸습니다.");
        setTimeout(() => setNotice(""), 900);
        return;
      }

      // 일시적으로 비활성화해 디바운싱
      setVoteDisabledIds((p) => ({ ...p, [jokeId]: true }));
      setTimeout(
        () => setVoteDisabledIds((p) => ({ ...p, [jokeId]: false })),
        800
      );

      setVotes((prevVotes) => {
        const prev = prevVotes[jokeId] || { likes: 0, dislikes: 0 };
        const updated = {
          ...prevVotes,
          [jokeId]: { ...prev, likes: prev.likes + 1 },
        };
        try {
          localStorage.setItem("jokeVotes", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [voteDisabledIds]
  );

  const handleDislike = useCallback(
    (jokeId) => {
      if (voteDisabledIds[jokeId]) {
        setNotice("잠시만요 — 버튼이 너무 빠르게 눌렸습니다.");
        setTimeout(() => setNotice(""), 900);
        return;
      }

      setVoteDisabledIds((p) => ({ ...p, [jokeId]: true }));
      setTimeout(
        () => setVoteDisabledIds((p) => ({ ...p, [jokeId]: false })),
        800
      );

      setVotes((prevVotes) => {
        const prev = prevVotes[jokeId] || { likes: 0, dislikes: 0 };
        const updated = {
          ...prevVotes,
          [jokeId]: { ...prev, dislikes: prev.dislikes + 1 },
        };
        try {
          localStorage.setItem("jokeVotes", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [voteDisabledIds]
  );

  // 랜덤/정답 버튼을 감싸는 디바운스 래퍼
  const handleGetRandom = useCallback(() => {
    if (isLoading || randomDisabled) {
      setNotice("조금만 기다려 주세요...");
      setTimeout(() => setNotice(""), 900);
      return;
    }
    setRandomDisabled(true);
    getRandomJoke();
    setTimeout(() => setRandomDisabled(false), 600);
  }, [isLoading, randomDisabled, getRandomJoke]);

  const handleShowAnswer = useCallback(() => {
    if (answerDisabled) return;
    setAnswerDisabled(true);
    showAnswerHandler();
    setTimeout(() => setAnswerDisabled(false), 400);
  }, [answerDisabled, showAnswerHandler]);

  const playClick = () => {
    try {
      const a = new Audio(clickSfx);
      a.volume = 0.3;
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // 키보드 단축키 등록 (폼에 포커스된 경우 제외)
    const onKey = (e) => {
      const active = document.activeElement && document.activeElement.tagName;
      if (active && ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(active))
        return;
      if (e.code === "Space") {
        e.preventDefault();
        handleGetRandom();
      } else if (e.code === "Enter") {
        if (currentJoke && !showAnswer) {
          handleShowAnswer();
        }
      } else if (e.code === "KeyL") {
        if (currentJoke) handleLike(currentJoke.id);
      } else if (e.code === "KeyD") {
        if (currentJoke) handleDislike(currentJoke.id);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    handleGetRandom,
    currentJoke,
    showAnswer,
    handleShowAnswer,
    handleLike,
    handleDislike,
  ]);

  // 이름 입력 관련 기능 제거 (개인화 없음)

  return (
    <>
      <div className={`app-container ${terminalMode ? "terminal-theme" : ""}`}>
        {terminalMode && (
          <div className="terminal-header" aria-hidden>
            Aje-Terminal v1.0 — type Space to load a joke
          </div>
        )}
        <h1 className="app-title">모자람 없어도... 재미는 있으니까...</h1>
        <p className="app-subtitle">웃으면 너도 아저씨</p>

        <div className="controls-row">
          <button
            onClick={handleGetRandom}
            className="random-button"
            aria-label="새로운 아재개그 랜덤으로 보기"
            disabled={isLoading || randomDisabled}
          >
            {isLoading ? "로딩 중..." : "개그 감상하기"}
          </button>
          <button
            onClick={resetJoke}
            className="random-button"
            aria-label="리셋"
            disabled={isLoading || randomDisabled}
            style={{ marginLeft: 8 }}
          >
            리셋
          </button>
          <button
            onClick={() => {
              setTerminalMode((v) => !v);
              playClick();
            }}
            className="random-button"
            aria-label="터미널 모드 토글"
            style={{ marginLeft: 8 }}
          >
            {terminalMode ? "터미널 종료" : "터미널 모드"}
          </button>
        </div>

        <div className={`smile-wrap ${terminalMode ? "terminal" : ""}`}>
          <pre
            className={`smile-guy ${asciiHovered ? "hovered" : ""}`}
            aria-label="웃는 얼굴 ASCII 아트"
            onMouseEnter={() => setAsciiHovered(true)}
            onMouseLeave={() => setAsciiHovered(false)}
          >
            {SMILE_ASCII_ART}
          </pre>
          <div className="scanlines" aria-hidden="true" />
        </div>

        {notice && (
          <div className="notice" role="status" aria-live="polite">
            {notice}
          </div>
        )}

        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            ⚠️ {error}
          </div>
        )}

        {currentJoke ? (
          <>
            <JokeCard
              joke={currentJoke}
              showAnswer={showAnswer}
              onShowAnswer={handleShowAnswer}
              isLoading={isLoading}
              onLike={handleLike}
              onDislike={handleDislike}
              likeCount={
                (votes[currentJoke.id] && votes[currentJoke.id].likes) || 0
              }
              dislikeCount={
                (votes[currentJoke.id] && votes[currentJoke.id].dislikes) || 0
              }
              voteDisabled={!!voteDisabledIds[currentJoke.id]}
              terminalMode={terminalMode}
            />

            {/* 개그 확인 후 다음 개그 버튼 */}
            <div className="next-joke-section">
              <button
                onClick={handleGetRandom}
                className="random-button next-joke-button"
                aria-label="다음 아재개그 보기"
                disabled={isLoading || randomDisabled}
              >
                {isLoading ? "로딩 중..." : "🎭 다음 개그 보기"}
              </button>
              <button
                onClick={resetJoke}
                className="random-button secondary-button"
                aria-label="처음으로 돌아가기"
                disabled={isLoading || randomDisabled}
                style={{ marginLeft: 12 }}
              >
                🏠 처음으로
              </button>
            </div>
          </>
        ) : (
          <p className="hint">
            개그를 보려면 위 버튼을 누르거나 스페이스바를 눌러보세요.
          </p>
        )}

        <p className="joke-count">
          총 {ajeData.length}개의 아재개그가 수록되어있는 모음-집
        </p>
      </div>
      <footer className="app-footer">
        <div className="keyboard-hint">
          단축키: Space - 랜덤 개그, Enter - 정답 보기, L - 좋아요, D - 싫어요
        </div>
      </footer>
    </>
  );
}

export default App;
