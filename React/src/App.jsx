import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import ajeData from "./data/Aje.json";
import { useJokes } from "./hooks/useJokes";
import JokeCard from "./components/JokeCard.jsx";
function App() {
  // 클릭 디바운싱 / UX 개선을 위한 상태
  const [randomDisabled, setRandomDisabled] = useState(false);
  const [answerDisabled, setAnswerDisabled] = useState(false);
  const [voteDisabledIds, setVoteDisabledIds] = useState({});
  const [notice, setNotice] = useState("");

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
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🎭 아재개그 모음집</h1>
        <p className="app-subtitle">웃으면 너도 아저씨</p>
      </header>

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

      <main className="main-content">
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
            />

            <div className="action-buttons">
              <button
                onClick={handleGetRandom}
                className="primary-button"
                aria-label="다음 아재개그 보기"
                disabled={isLoading || randomDisabled}
              >
                {isLoading ? "로딩 중..." : "🎲 다음 개그"}
              </button>
            </div>
          </>
        ) : (
          <div className="welcome-section">
            <div className="welcome-emoji">😄</div>
            <p className="welcome-text">오늘의 아재개그를 감상해보세요!</p>
            <button
              onClick={handleGetRandom}
              className="primary-button large"
              aria-label="아재개그 시작하기"
              disabled={isLoading || randomDisabled}
            >
              {isLoading ? "로딩 중..." : "🎭 개그 감상하기"}
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p className="joke-count">총 {ajeData.length}개의 아재개그 수록</p>
        <p className="keyboard-hint">Space: 다음 개그 | Enter: 정답 보기</p>
      </footer>
    </div>
  );
}

export default App;
