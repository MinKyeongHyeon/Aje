import React from "react";
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
}) => {
  if (!joke) return null;

  const answerText = joke.answer;

  return (
    <div
      className="joke-card"
      role="article"
      aria-labelledby={`joke-question-${joke.id}`}
    >
      <div className="question-section">
        <span className="question-label">Q.</span>
        <h2 id={`joke-question-${joke.id}`} className="question">
          {joke.question}
        </h2>
      </div>

      <div className="answer-section">
        {!showAnswer ? (
          <button
            onClick={onShowAnswer}
            className="answer-button"
            aria-label="정답 보기"
            disabled={isLoading}
          >
            🤔 정답 보기
          </button>
        ) : (
          <div className="answer-container" role="alert" aria-live="polite">
            <span className="answer-label">A.</span>
            <p className="answer">{answerText}</p>
          </div>
        )}
      </div>

      {showAnswer && (
        <div className="vote-row">
          <button
            className="vote-button like"
            onClick={() => onLike && onLike(joke.id)}
            aria-label={`좋아요 ${likeCount}개`}
            disabled={voteDisabled}
          >
            👍 {likeCount}
          </button>
          <button
            className="vote-button dislike"
            onClick={() => onDislike && onDislike(joke.id)}
            aria-label={`싫어요 ${dislikeCount}개`}
            disabled={voteDisabled}
          >
            👎 {dislikeCount}
          </button>
        </div>
      )}
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
};

JokeCard.defaultProps = {
  joke: null,
  isLoading: false,
  onLike: null,
  onDislike: null,
  likeCount: 0,
  dislikeCount: 0,
  voteDisabled: false,
};

export default JokeCard;
