import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "../App.jsx";

test("App renders title", () => {
  render(<App />);
  // App title uses Korean text; assert a substring to avoid fragile punctuation
  expect(screen.getByText(/모자람 없어도/i)).toBeInTheDocument();
});
