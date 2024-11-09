# Skewdle 📰

> Skewdle is my submission for Inversity's FT News Frontier challenge. It is a daily trivia game that improves players' media literacy by challenging them to identify incorrect or misleading facts/claims inserted into articles from the Financial Times. The game uses OpenAI's gpt-4o model to generate the modifications to the original article text.

## Project Structure

The project is structured as follows:

* `src`: This directory contains the source code for the game, including the React components, game logic, and utility functions.
* `public`: This directory contains the static assets for the game, including the index.html file, favicon, and other images.
* `tests`: This directory contains the unit tests and integration tests for the game.
* `game-generator`: This contains the ArticleGenerator tool, a prototype of how daily games could be generated from the FT's articles. This 'library' would be used by the FT team to generate the daily games.

## Features
* The game has multiple levels each day of increasing difficulty
* Easy, medium, hard and flawless difficulty modes. Flawless mode allows no incorrect answers.
* Game timer contributes to score, and is decreased by incorrect answers
* Stats page shows player's current and best streak and scores.
* Unlockable achievements which are persisted to local storage
* Global leaderboard to compare cumulative scores with other players
* Dark/Light mode
* Accessibility features such as keyboard navigation and screen reader support
* Audio feedback for correct and incorrect answers

## Libraries Used

The game uses the following libraries:

* React: A popular JavaScript library for building user interfaces.
* Tailwind CSS: A utility-first CSS framework for building custom user interfaces.
* Radix UI: A set of pre-built UI components for building web applications.
* Lucide React: A set of React icons for building web applications.
* Jest: A popular testing framework for JavaScript.
* ESLint: A popular linter for JavaScript.

## Accessibility

The game is designed to be accessible and user-friendly, with a focus on providing a fun and engaging experience for players. The game uses ARIA attributes and semantic HTML to ensure that the game is accessible to players with disabilities.

## Testing

The game uses Jest for unit testing and integration testing. The tests are located in the `tests` directory and cover the game logic, React components, and utility functions.

## CI/CD

The game uses a CI/CD pipeline to automate the testing, building, and deployment of the game. The pipeline is configured using GitHub Actions and deploys the game to a production environment.

## Tailwind CSS Configuration

The game uses Tailwind CSS for styling and layout. The Tailwind CSS configuration is located in the `tailwind.config.js` file and defines the custom colors, font families, and other styles used in the game.

## React Axe

The game uses React Axe for accessibility testing. React Axe is a library that provides a set of accessibility rules and tools for building accessible React applications.

## Game Generator Library

The game-generator library is a separate utility from the main game. It is used to generate daily games from the FT's articles. The library uses OpenAI's GPT-4 model to modify article excerpts by adding incorrect facts/claims in [square brackets] and surprising but true facts in (parentheses).

### How it works

The library fetches article text from the FT's backend and then uses OpenAI's GPT-4 model to generate modified article text. The model is trained to identify key facts/claims and generate plausible but incorrect alternatives, as well as correct claims that players might think are incorrect.

### Features

* Generates modified article text with incorrect facts/claims in [square brackets] and surprising but true facts in (parentheses)
* Supports three difficulty levels: easy, medium, and hard
* Supports three modification types: incorrect, surprising, and both
* Uses OpenAI's GPT-4 model to generate high-quality modified article text

## Technical Details

* Built using React, Tailwind CSS, and OpenAI's GPT-4 model
* Uses dotenv to load environment variables from a .env file
* Uses fetch to fetch article text from the FT's backend
* Uses OpenAI's chat.completions.create method to generate modified article text

