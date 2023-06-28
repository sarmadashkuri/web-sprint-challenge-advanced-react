// Write your tests here
import AppFunctional from "./AppFunctional";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import React from "react";

// test('sanity', () => {
//   expect(true).toBe(false)
// })

test('renders without errors', () => {
  render(<AppFunctional />);
})
