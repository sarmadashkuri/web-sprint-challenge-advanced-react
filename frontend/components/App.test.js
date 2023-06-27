// Write your tests here
import AppFunctional from "./AppFunctional";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

test('sanity', () => {
  expect(true).toBe(false)
})

test('moving up twice from origin displays the message You cant go up', () => {
  render(<AppFunctional />);
  const upButton = screen.getByText(/up/i);
  userEvent.click(upButton);
  userEvent.click(upButton);
  expect(screen.getByText(`You can't go up`)).toBeInTheDocument();
})
