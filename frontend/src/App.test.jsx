// This file can be deleted if you'd like
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  await act(async () => {
    render(<App />);
  })
  const linkElement = screen.getByText(/o/i); // random letter
  expect(linkElement).toBeInTheDocument();
});
