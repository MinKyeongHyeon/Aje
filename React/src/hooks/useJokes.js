import { useState, useCallback } from "react";

/**
 * 아재개그 관리를 위한 커스텀 훅
 * @param {Array} jokesData - 아재개그 데이터 배열
 * @returns {Object} 개그 상태와 관련 함수들
 */
export const useJokes = (jokesData) => {
  const [currentJoke, setCurrentJoke] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRandomIndex = useCallback((max) => {
    return Math.floor(Math.random() * max);
  }, []);

  const getRandomJoke = useCallback(() => {
    if (!jokesData || jokesData.length === 0) {
      setError("아재개그를 불러올 수 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const randomIndex = getRandomIndex(jokesData.length);
      setCurrentJoke(jokesData[randomIndex]);
      setShowAnswer(false);
    } catch (err) {
      setError("개그를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [jokesData, getRandomIndex]);

  const showAnswerHandler = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const resetJoke = useCallback(() => {
    setCurrentJoke(null);
    setShowAnswer(false);
    setError(null);
  }, []);

  return {
    currentJoke,
    showAnswer,
    isLoading,
    error,
    getRandomJoke,
    showAnswerHandler,
    resetJoke,
  };
};
