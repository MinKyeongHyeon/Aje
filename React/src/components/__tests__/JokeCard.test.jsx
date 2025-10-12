import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import JokeCard from "../JokeCard";

const sampleJoke = {
  id: 1,
  question: "왜 바다가 파랄까요?",
  answer: "파란색이기 때문이에요.",
};

describe("JokeCard", () => {
  test("renders question and answer button", () => {
    render(
      <JokeCard
        joke={sampleJoke}
        showAnswer={false}
        onShowAnswer={() => {}}
        isLoading={false}
        onLike={() => {}}
        onDislike={() => {}}
        likeCount={0}
        dislikeCount={0}
        voteDisabled={false}
      />
    );

    expect(screen.getByText(/왜 바다가 파랄까요\?/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /정답 보기/ })
    ).toBeInTheDocument();
  });

  test("shows typing answer when showAnswer is true", () => {
    const handleShow = vi.fn();
    render(
      <JokeCard
        joke={sampleJoke}
        showAnswer={true}
        onShowAnswer={handleShow}
        isLoading={false}
        onLike={() => {}}
        onDislike={() => {}}
        likeCount={0}
        dislikeCount={0}
        voteDisabled={false}
      />
    );

    // should show partial answer (typed state starts empty then types)
    const el = screen.getByRole("alert");
    expect(el).toBeInTheDocument();
  });
});
