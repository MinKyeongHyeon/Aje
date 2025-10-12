import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "../App.jsx";

test("App renders title", () => {
  render(<App />);
  expect(screen.getByText(/Aje/i)).toBeInTheDocument();
});
