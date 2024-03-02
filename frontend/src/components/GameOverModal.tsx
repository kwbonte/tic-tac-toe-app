import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface GameOverModalProps {
  player1Name: string;
  player2Name: string;
  currentTurn: string;
  gameStatus: "complete" | "draw" | "in_progress" | "";
  open: boolean;
  handleClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  player1Name,
  player2Name,
  currentTurn,
  gameStatus,
  open,
  handleClose,
}) => {
  let title = "";
  let contentText = "";

  switch (gameStatus) {
    case "complete":
      title = "Game Over";
      contentText = `${currentTurn == "X" ? player1Name : player2Name} wins!`;
      break;
    case "draw":
      title = "Game Over";
      contentText = `TIE No Winner.`;
      break;
    default:
      console.error("Invalid game status");
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="win-tie-dialog-title"
      aria-describedby="win-tie-dialog-description"
    >
      <DialogTitle id="win-tie-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="win-tie-dialog-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameOverModal;
