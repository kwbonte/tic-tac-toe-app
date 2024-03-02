import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
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

export default function GameBoard() {
  const [isGameInProgress, setIsGameInProgress] = React.useState(false); // Initialize the game state as not in progress
  const [currentTurn, setCurrentTurn] = React.useState("X");
  const handleCellClick = (id: number) => {
    // Handle cell click here. For instance, update the game state or toggle turn
    console.log(`Cell clicked: ${id}, ${currentTurn}`);
    // iterate turn
    if (currentTurn === "X") {
      setCurrentTurn("O");
    } else {
      setCurrentTurn("X");
    }
  };

  const startButtonClicked = () => {
    console.log("startbuttonclicked");
    setIsGameInProgress(true);
    setCurrentTurn("X");
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
