import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '../src/components/Game';

describe('Game component', () => {
  it('renders game container', () => {
    const gameStatus = 'idle';
    const currentLevel = 1;
    const score = 0;
    const timeLeft = 60;
    const difficulty = 'medium';
    const setDifficulty = jest.fn();
    const startGame = jest.fn();
    const handleTextSelection = jest.fn();
    const selectedParts = {};

    const { getByText } = render(
      <Game
        gameStatus={gameStatus}
        currentLevel={currentLevel}
        score={score}
        timeLeft={timeLeft}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        startGame={startGame}
        handleTextSelection={handleTextSelection}
        selectedParts={selectedParts}
      />
    );

    expect(getByText('Level 1')).toBeInTheDocument();
  });

  it('calls startGame when the start button is clicked', () => {
    const gameStatus = 'idle';
    const currentLevel = 1;
    const score = 0;
    const timeLeft = 60;
    const difficulty = 'medium';
    const setDifficulty = jest.fn();
    const startGame = jest.fn();
    const handleTextSelection = jest.fn();
    const selectedParts = {};

    const { getByText } = render(
      <Game
        gameStatus={gameStatus}
        currentLevel={currentLevel}
        score={score}
        timeLeft={timeLeft}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        startGame={startGame}
        handleTextSelection={handleTextSelection}
        selectedParts={selectedParts}
      />
    );

    const startButton = getByText('Start Game');
    fireEvent.click(startButton);

    expect(startGame).toHaveBeenCalledTimes(1);
  });
});
