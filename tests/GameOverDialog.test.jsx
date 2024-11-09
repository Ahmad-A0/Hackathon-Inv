import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { GameOverDialog } from '../src/components/GameOverDialog';

describe('GameOverDialog component', () => {
  it('renders game over dialog', () => {
    const score = 100;
    const difficulty = 'easy';
    const gameOver = true;

    const { getByText } = render(
      <GameOverDialog score={score} difficulty={difficulty} gameOver={gameOver} />
    );

    expect(getByText('Game Over')).toBeInTheDocument();
  });
});
