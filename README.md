# World Cup Predictions Tracker

A local web app to track World Cup match predictions and scores.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to: http://localhost:3000

## Features

- Add matches with team names
- Each player (Martin, Joaquin, Pablo, Franco, Fede, Juan) can enter predictions
- Enter actual results to automatically calculate points
- Scoring:
  - **3 points**: Exact score match
  - **1 point**: Correct outcome (winner/draw)
  - **0 points**: Wrong prediction
- Live rankings table
- Data persists to `data.json` file

## Usage

1. Add a new match by entering the teams
2. Enter predictions for each player (format: `2-1`)
3. Once the match is played, enter the actual result
4. Points are calculated automatically
5. Check the rankings table at the top
