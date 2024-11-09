import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ArticleText } from '../src/components/ArticleText';

describe('ArticleText component', () => {
  it('renders article text', () => {
    const articleParts = [
      { type: 'normal', content: 'This is a normal text' },
      { type: 'incorrect', content: 'This is an incorrect text' },
    ];
    const selectedParts = {};
    const handleTextSelection = jest.fn();

    const { getByText } = render(
      <ArticleText
        articleParts={articleParts}
        selectedParts={selectedParts}
        handleTextSelection={handleTextSelection}
      />
    );

    expect(getByText('This is a normal text')).toBeInTheDocument();
    expect(getByText('This is an incorrect text')).toBeInTheDocument();
  });

  it('calls handleTextSelection when an incorrect text is clicked', () => {
    const articleParts = [
      { type: 'normal', content: 'This is a normal text' },
      { type: 'incorrect', content: 'This is an incorrect text' },
    ];
    const selectedParts = {};
    const handleTextSelection = jest.fn();

    const { getByText } = render(
      <ArticleText
        articleParts={articleParts}
        selectedParts={selectedParts}
        handleTextSelection={handleTextSelection}
      />
    );

    const incorrectText = getByText('This is an incorrect text');
    fireEvent.click(incorrectText);

    expect(handleTextSelection).toHaveBeenCalledTimes(1);
  });
});
