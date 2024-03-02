import React from "react";
import { CssBaseline, Container, Typography } from "@mui/material";
import GameBoard from "./components/GameBoard";

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          marginTop: 4,
          padding: "0 8px" /* Add padding here */,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Tic Tac Toe
        </Typography>
        <GameBoard />
      </Container>
    </>
  );
};

export default App;
