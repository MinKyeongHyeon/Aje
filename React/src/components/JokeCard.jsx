import React from "react";
import PropTypes from "prop-types";
import "./JokeCard.css";

/**
 * 개별 개그를 표시하는 컴포넌트
 */
const JokeCard = ({ joke, showAnswer, onShowAnswer, isLoading }) => {
  if (!joke) return null;

  return (
    <div
      className="joke-container"
      role="article"
      aria-labelledby="joke-question"
    >
      <h2 id="joke-question" className="question">
        Q: {joke.question}
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
            <h3 className="answer">A: {joke.answer} ㅋㅋ</h3>
          </div>
        )}
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
};

JokeCard.defaultProps = {
  joke: null,
  isLoading: false,
};

export default JokeCard;
