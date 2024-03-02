import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Cell } from "./Cell";
import { Button } from "@mui/material";

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
      throw new Error("Network response was not ok");
    }

    const moveData = await response.json();
    console.log("Move recorded:", moveData);

    // Handle successful move recording here
    // For example, update the game state or UI based on the response
  } catch (error) {
    console.error("Error recording move:", error);
    // Handle errors, such as displaying an error message to the user
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
      throw new Error("Network response was not ok");
    }

    const newGame = await response.json();
    console.log("New game started:", newGame);
    return newGame; // Return the new game data
  } catch (error) {
    console.error("Failed to start new game:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export default function GameBoard() {
  const [isGameInProgress, setIsGameInProgress] = React.useState(false); // Initialize the game state as not in progress
  const [currentTurn, setCurrentTurn] = React.useState("X");
  const [gameId, setGameId] = React.useState(0);
  const handleCellClick = (id: number) => {
    // Handle cell click here. For instance, update the game state or toggle turn
    console.log(`Cell clicked: ${id}, ${currentTurn}`);
    try {
      const result = recordMove(gameId, currentTurn, id);
      console.log("result from onclick", result);
    } catch (err) {
      throw err;
    }
    // iterate turn
    if (currentTurn === "X") {
      setCurrentTurn("O");
    } else {
      setCurrentTurn("X");
    }
  };

  const startButtonClicked = async () => {
    // Assuming playerXName and playerOName are already defined in your component's state
    const playerXName = "Player X"; // Replace with actual state variable or input
    const playerOName = "Player O"; // Replace with actual state variable or input
    try {
      const newGame = await createNewGame(playerXName, playerOName);
      // Update your component's state as necessary based on the new game data
      setIsGameInProgress(true);
      setGameId(newGame.game_id);
      setCurrentTurn(newGame.current_turn); // Assuming you have a state variable for currentTurn
      setIsGameInProgress(true);
      setCurrentTurn("X");
    } catch (error) {
      console.error("Failed to start new game:", error);
      // Handle errors as needed, such as displaying an error message to the user
      // For example, display errors via a modal
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledGridContainer
        container
        spacing={{ xs: 0.5, md: 0.5 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Array.from(Array(9)).map((_, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Cell
              id={index}
              currentTurn={currentTurn}
              disabled={!isGameInProgress}
              onClick={handleCellClick}
            />
          </Grid>
        ))}
      </StyledGridContainer>
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
    </Box>
  );
}
