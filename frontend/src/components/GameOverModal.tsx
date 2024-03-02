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

  // Determine background color based on gameStatus and currentTurn
  const backgroundColor = () => {
    if (gameStatus === "draw") {
      return "yellow";
    } else if (gameStatus === "complete" && currentTurn === "X") {
      return "red";
    } else if (gameStatus === "complete" && currentTurn === "O") {
      return "blue";
    }
    return ""; // Default background color if none of the conditions match
  };
  return (
    <Dialog
      open={open}
      maxWidth={"lg"}
      onClose={handleClose}
      aria-labelledby="win-tie-dialog-title"
      aria-describedby="win-tie-dialog-description"
      sx={{
        // Apply conditional background color
        backgroundColor: backgroundColor(),
      }}
    >
      <DialogTitle
        id="win-tie-dialog-title"
        sx={{
          textAlign: "center",
          fontSize: "32px",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          width: "300px",
          textAlign: "center",
        }}
      >
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
