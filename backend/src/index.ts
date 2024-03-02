import express, { Request, Response } from "express";
import db from "./db"; // Make sure db.ts is updated for TypeScript
import { Game, Move } from "./types";

const app = express();
const port = 3001;

app.use(express.json());
const cors = require("cors");

// Use it before all route definitions
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend origin to make requests
  })
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// start new game
app.post("/games", async (req: Request, res: Response) => {
  const {
    player_x_name,
    player_o_name,
  }: { player_x_name: string; player_o_name: string } = req.body;
  try {
    const newGame: Game = (
      await db.query(
        "INSERT INTO games (player_x_name, player_o_name, current_turn, game_status) VALUES ($1, $2, $3, $4) RETURNING *",
        [player_x_name, player_o_name, "X", "in_progress"]
      )
    ).rows[0];
    res.json(newGame);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }
});

// recording a move
app.post("/moves", async (req: Request, res: Response) => {
  const {
    game_id,
    player_type,
    position,
  }: { game_id: number; player_type: "X" | "O"; position: number } = req.body;
  const move_time = new Date();
  try {
    // Check the current status of the game
    const { status: gameStatus, currentTurn } = await checkGameStatus(game_id);
    if (gameStatus !== "in_progress") {
      return res
        .status(400)
        .send({ error: "Game is not in progress. Moves cannot be recorded." });
    }

    // ensure the correct player is submitting a turn
    if (player_type !== currentTurn) {
      return res.status(400).send({ error: `It's not ${player_type}'s turn.` });
    }

    // Then, validate the move is to an unoccupied position
    const validMove = await ensureMoveIsNotOverwrite(game_id, position);
    if (!validMove) {
      return res
        .status(400)
        .send({ error: "Invalid move. The position is already occupied." });
    }

    const newMove: Move = (
      await db.query(
        "INSERT INTO moves (game_id, player_type, position, move_time) VALUES ($1, $2, $3, $4) RETURNING *",
        [game_id, player_type, position, move_time]
      )
    ).rows[0];

    // Reconstruct the board state
    const board = await getBoardState(game_id);
    console.log(board);
    // Evaluate the game status and update next turn
    const status: GameStatus = evaluateGameStatus(board);
    const nextTurn = player_type === "X" ? "O" : "X";
    // Update the game status in the database if the game is complete or a draw
    await db.query(
      "UPDATE games SET game_status = $1, current_turn = $2 WHERE game_id = $3",
      [status, nextTurn, game_id]
    );
    res.json({ move: newMove, gameStatus: status });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

type PlayerType = "X" | "O" | null;
type GameStatus = "in_progress" | "complete" | "draw";

function evaluateGameStatus(board: PlayerType[]): GameStatus {
  // Define winning combinations
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  // Check for a winner
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return "complete";
    }
  }

  // Check for a draw (if there are no nulls left on the board)
  const isDraw = board.every((position) => position !== null);
  if (isDraw) {
    return "draw";
  }

  // If no winner and no draw, the game is still in progress
  return "in_progress";
}

async function getBoardState(game_id: number): Promise<PlayerType[]> {
  const board: PlayerType[] = Array(9).fill(null);
  try {
    const movesResult = await db.query(
      "SELECT * FROM moves WHERE game_id = $1 ORDER BY move_time ASC",
      [game_id]
    );
    movesResult.rows.forEach((move) => {
      board[move.position] = move.player_type;
    });
    return board;
  } catch (err: any) {
    console.error(err.message);
    throw new Error("Failed to reconstruct the board state.");
  }
}

async function checkGameStatus(
  game_id: number
): Promise<{ status: GameStatus; currentTurn: PlayerType }> {
  try {
    const result = await db.query(
      "SELECT game_status, current_turn FROM games WHERE game_id = $1",
      [game_id]
    );
    if (result.rows.length > 0) {
      return {
        status: result.rows[0].game_status as GameStatus,
        currentTurn: result.rows[0].current_turn as PlayerType,
      };
    } else {
      throw new Error("Game not found.");
    }
  } catch (err: any) {
    console.error(err.message);
    throw new Error("Failed to check the game status and current turn.");
  }
}

async function ensureMoveIsNotOverwrite(
  game_id: number,
  position: number
): Promise<boolean> {
  const board = await getBoardState(game_id);
  // Check if the position is within the board and unoccupied
  return board[position] === null;
}
