import { useState, useEffect, useCallback } from "react";
import "./App.css";
import ajeData from "./data/Aje.json";
import { useJokes } from "./hooks/useJokes";
import JokeCard from "./components/JokeCard.jsx";
import { SMILE_ASCII_ART } from "./constants/asciiArt";

function App() {
  // 사용자 이름 입력 및 저장
  const [name, setName] = useState("");
  const [asciiHovered, setAsciiHovered] = useState(false);
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
    // 이름 복원
    const savedName = localStorage.getItem("aje_name");
    if (savedName) setName(savedName);

    // 키보드 단축키 등록
    const onKey = (e) => {
      // 폼 요소에 포커스가 있는 경우 단축키 무시
      const active = document.activeElement && document.activeElement.tagName;
      if (active && ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(active)) return;
      // 스페이스: 랜덤 개그, Enter: 정답 보기, L: 좋아요, D: 싫어요
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
    // 의존성은 안정적인 콜백들만 포함
  }, [
    handleGetRandom,
    currentJoke,
    showAnswer,
    handleShowAnswer,
    handleLike,
    handleDislike,
  ]);

  const onNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    try {
      localStorage.setItem("aje_name", v);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">모자람 없어도... 재미는 있으니까...</h1>
        <p className="app-subtitle">웃으면 너도 아저씨</p>

        <div className="controls-row">
          <label htmlFor="name-input" className="name-label">
            이름 입력하면 개인화 인사 보기:
          </label>
          <input
            id="name-input"
            className="name-input"
            placeholder="이름을 입력하세요 (예: 철수)"
            value={name}
            onChange={onNameChange}
            aria-label="사용자 이름"
          />
          <button
            onClick={handleGetRandom}
            className="random-button"
            aria-label="새로운 아재개그 랜덤으로 보기"
            disabled={isLoading || randomDisabled}
          >
            {isLoading ? "로딩 중..." : "개그 감상하기 (Space)"}
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
        </div>

        {name && <p className="greeting">안녕, {name}님! 개그 시작해볼까?</p>}

        <pre
          className={`smile-guy ${asciiHovered ? "hovered" : ""}`}
          aria-label="웃는 얼굴 ASCII 아트"
          onMouseEnter={() => setAsciiHovered(true)}
          onMouseLeave={() => setAsciiHovered(false)}
        >
          {SMILE_ASCII_ART}
        </pre>

        {notice && (
          <div className="notice" role="status" aria-live="polite">{notice}</div>
        )}

        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            ⚠️ {error}
          </div>
        )}

        {currentJoke ? (
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
        ) : (
          <p className="hint">
            개그를 보려면 위 버튼을 누르거나 스페이스바를 눌러보세요.
          </p>
        )}

        <p className="joke-count">
          총 {ajeData.length}개의 아재개그가 수록되어있는 모음-집
        </p>

        <div className="keyboard-hint">
          단축키: Space - 랜덤 개그, Enter - 정답 보기, L - 좋아요, D - 싫어요
        </div>
      </div>
    </>
  );
}

export default App;
