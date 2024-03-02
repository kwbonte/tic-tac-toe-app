import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Cell } from "./Cell";
import { Button } from "@mui/material";
import ErrorModal from "./ErrorModal";
import GameOverModal from "./GameOverModal";

// Customizing grid container for tic-tac-toe style borders
const StyledGridContainer = styled(Grid)(({ theme }) => ({
  "& .MuiGrid-item": {
    borderRight: `5px solid ${theme.palette.text.secondary}`,
    borderBottom: `5px solid ${theme.palette.text.secondary}`,
  },
  "& .MuiGrid-item:nth-of-type(3n)": {
    borderRight: "none", // Remove right border for rightmost items
  },
  "& .MuiGrid-item:nth-last-of-type(-n+3)": {
    borderBottom: "none", // Remove bottom border for bottom items
  },
}));

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "APIError";
  }
}

const recordMove = async (
  gameId: number,
  playerType: string,
  position: number
) => {
  try {
    const response = await fetch("http://localhost:3001/moves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_id: gameId,
        player_type: playerType,
        position: position,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error || "An unknown error occurred";
      throw new APIError(errorMessage);
    }

    const moveData = await response.json();
    console.log("Move recorded:", moveData);
    return moveData;
    // Handle successful move recording here
    // For example, update the game state or UI based on the response
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    } else {
      throw new APIError("An unexpected error occurred"); // forcing a remap so it can be consumed
    }
  }
};

// Function to create a new game by posting to the backend
const createNewGame = async (playerXName: string, playerOName: string) => {
  try {
    const response = await fetch("http://localhost:3001/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_x_name: playerXName,
        player_o_name: playerOName,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error || "An unknown error occurred";
      throw new APIError(errorMessage);
    }
    const newGame = await response.json();
    return newGame;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    } else {
      throw new APIError("An unexpected error occurred"); // forcing a remap so it can be consumed
    }
  }
};

export default function GameBoard() {
  const [isGameInProgress, setIsGameInProgress] = React.useState(false); // Initialize the game state as not in progress
  const [currentTurn, setCurrentTurn] = React.useState("X");
  const [gameId, setGameId] = React.useState(0);
  const [clearAndResetButtonShow, setClearAndResetButtonShow] =
    React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = React.useState<boolean>(false);
  const [openGameOverModal, setGameOverModal] = React.useState(false);
  const [cells, setCells] = React.useState(Array(9).fill(null)); // Example for a 3x3 board
  const [resetFlag, setResetFlag] = React.useState(false);
  const [gameStatus, setGameStatus] = React.useState<
    "complete" | "draw" | "in_progress" | ""
  >("");
  const playerXName = "Player X"; // Replace with actual state variable or input
  const playerOName = "Player O"; // Replace with actual state variable or input

  const handleClose = () => {
    setErrorModalOpen(false);
  };
  const handleGameOverModalClose = () => {
    setGameOverModal(false);
  };
  const handleCellClick = async (id: number) => {
    // Handle cell click here. For instance, update the game state or toggle turn
    try {
      const result = await recordMove(gameId, currentTurn, id);
      // evaluate if done
      if (result?.gameStatus !== "in_progress") {
        console.log("DONE");
        setClearAndResetButtonShow(true);
        setGameStatus(result?.gameStatus);
        setGameOverModal(true);
      } else {
        // iterate turn
        if (currentTurn === "X") {
          setCurrentTurn("O");
        } else {
          setCurrentTurn("X");
        }
      }
    } catch (err: any) {
      if (err instanceof APIError) {
        setError(err.message);
        setErrorModalOpen(true);
      }

      throw err; // Re-throw the error to be handled by the caller
    }
  };

  const startButtonClicked = async () => {
    // Assuming playerXName and playerOName are already defined in your component's state
    try {
      const newGame = await createNewGame(playerXName, playerOName);
      // Update your component's state as necessary based on the new game data
      setIsGameInProgress(true);
      setGameId(newGame.game_id);
      setCurrentTurn(newGame.current_turn); // Assuming you have a state variable for currentTurn
      setIsGameInProgress(true);
      setCurrentTurn("X");
      setGameStatus("in_progress");
    } catch (error) {
      if (error instanceof APIError) {
        setError(error.message);
        setErrorModalOpen(true);
      }
    }
  };

  const resetBoard = () => {
    console.log("reset board selected");
    setGameId(0);
    setIsGameInProgress(false);
    setClearAndResetButtonShow(false);
    setCells(Array(9).fill(null)); // Reset the board state
    setResetFlag(!resetFlag); // Toggle the resetFlag to signal a board reset
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledGridContainer
        container
        spacing={{ xs: 0.5, md: 0.5 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {cells.map((cell, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Cell
              key={index}
              id={index}
              currentTurn={currentTurn}
              disabled={!isGameInProgress}
              onClick={handleCellClick}
              resetFlag={resetFlag} // Pass resetFlag to each Cell
            />
          </Grid>
        ))}
      </StyledGridContainer>
      {!clearAndResetButtonShow && (
        <Button
          variant="outlined"
          disabled={isGameInProgress}
          sx={{
            mt: 2,
          }}
          onClick={startButtonClicked}
        >
          Start New Game
        </Button>
      )}
      {clearAndResetButtonShow && (
        <Button
          variant="outlined"
          sx={{
            mt: 2,
          }}
          onClick={resetBoard}
        >
          RESET
        </Button>
      )}
      <ErrorModal
        open={errorModalOpen}
        error={error}
        handleClose={handleClose}
      />
      <GameOverModal
        player1Name={playerXName}
        player2Name={playerOName}
        currentTurn={currentTurn}
        gameStatus={gameStatus}
        open={openGameOverModal}
        handleClose={handleGameOverModalClose}
      />
    </Box>
  );
}
