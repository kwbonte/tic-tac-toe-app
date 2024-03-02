import express, { Request, Response } from "express";
import db from "./db"; // Make sure db.ts is updated for TypeScript
import { Game, Move } from "./types";

const app = express();
const port = 3001;

app.use(express.json());

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
    res.status(500).send("Server error");
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
    const newMove: Move = (
      await db.query(
        "INSERT INTO moves (game_id, player_type, position, move_time) VALUES ($1, $2, $3, $4) RETURNING *",
        [game_id, player_type, position, move_time]
      )
    ).rows[0];
    res.json(newMove);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
