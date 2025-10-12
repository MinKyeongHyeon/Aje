import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./JokeCard.css";

/**
 * 개별 개그를 표시하는 컴포넌트
 */
const JokeCard = ({
  joke,
  showAnswer,
  onShowAnswer,
  isLoading,
  onLike,
  onDislike,
  likeCount,
  dislikeCount,
  voteDisabled,
  terminalMode,
  typingSpeed,
}) => {
  // typing effect state (hooks must be called unconditionally)
  const [typed, setTyped] = useState("");
  const answerText = joke ? joke.answer : "";

  const fullText = `A: ${answerText}`;
  const isTyping = showAnswer && typed !== fullText;

  useEffect(() => {
    if (!joke || !showAnswer) {
      setTyped("");
      return;
    }
    let i = 0;
    const text = `A: ${answerText}`;
    setTyped("");
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, typingSpeed);
    return () => clearInterval(id);
  }, [showAnswer, answerText, joke, typingSpeed]);

  if (!joke) return null;

  return (
    <div
      className="joke-container"
      role="article"
      aria-labelledby={`joke-question-${joke.id}`}
    >
      <h2
        id={`joke-question-${joke.id}`}
        className={`question ${terminalMode ? "terminal-question" : ""}`}
      >
        Q: {joke.question}
        {terminalMode && <span className="terminal-cursor" aria-hidden />}
      </h2>

      <div className="answer-section">
        {!showAnswer ? (
          <button
            onClick={onShowAnswer}
            className="answer-button"
            aria-label="정답 보기"
            disabled={isLoading}
          >
            정답 보기
          </button>
        ) : (
          <div className="answer-container" role="alert" aria-live="polite">
            <h3 className="answer">
              <span className={`typing-text ${isTyping ? "caret" : ""}`}>
                {typed}
              </span>
              {isTyping && <span className="terminal-cursor" aria-hidden />}
            </h3>
          </div>
        )}
      </div>

      <div className="vote-row" aria-hidden={false}>
        <button
          className="vote-button like"
          onClick={() => onLike && onLike(joke.id)}
          aria-label={`이 개그 좋아요 ${likeCount}개`}
          disabled={voteDisabled}
        >
          👍 {likeCount}
        </button>

        <button
          className="vote-button dislike"
          onClick={() => onDislike && onDislike(joke.id)}
          aria-label={`이 개그 싫어요 ${dislikeCount}개`}
          disabled={voteDisabled}
        >
          👎 {dislikeCount}
        </button>
      </div>
    </div>
  );
};

JokeCard.propTypes = {
  joke: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }),
  showAnswer: PropTypes.bool.isRequired,
  onShowAnswer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
  likeCount: PropTypes.number,
  dislikeCount: PropTypes.number,
  voteDisabled: PropTypes.bool,
  terminalMode: PropTypes.bool,
  typingSpeed: PropTypes.number,
};

JokeCard.defaultProps = {
  joke: null,
  isLoading: false,
  onLike: null,
  onDislike: null,
  likeCount: 0,
  dislikeCount: 0,
  voteDisabled: false,
  terminalMode: false,
  typingSpeed: 28,
};

export default JokeCard;
