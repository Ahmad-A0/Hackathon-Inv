import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Achievements } from '../src/components/Achievements';

describe('Achievements component', () => {
  it('renders achievements', () => {
    const achievements = {
      firstGame: true,
      perfectGame: false,
      speedRunner: true,
      marathoner: false,
      sharpEye: true,
    };

    const { getByText } = render(
      <Achievements achievements={achievements} />
    );

    expect(getByText('First Steps')).toBeInTheDocument();
    expect(getByText('Speed Reader')).toBeInTheDocument();
    expect(getByText('Sharp Eye')).toBeInTheDocument();
  });
});
