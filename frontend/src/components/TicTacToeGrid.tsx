import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TicTacToeCell from "./TicTacToeCell"; // Adjust the import path as necessary

const TicTacToeGrid: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(calculateGridSize());
  const [cellValues, setCellValues] = useState<Array<"X" | "O" | null>>(
    Array(9).fill(null)
  );

  // Dynamically calculate the grid size based on viewport size to maintain aspect ratio
  function calculateGridSize(): number {
    // Use 90vw as base size to give some margin around the grid, or adjust as needed
    const sizeBasedOnWidth = window.innerWidth * 0.55;
    const sizeBasedOnHeight = window.innerHeight * 0.55;
    // Choose the smaller of the two to ensure the grid fits within the viewport and maintains a square shape
    return Math.min(sizeBasedOnWidth, sizeBasedOnHeight);
  }

  useEffect(() => {
    function handleResize() {
      setGridSize(calculateGridSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCellClick = (cellNumber: number) => {
    const newCellValues = [...cellValues];
    newCellValues[cellNumber] = newCellValues[cellNumber] === "X" ? "O" : "X";
    setCellValues(newCellValues);
  };

  return (
    <Box
      sx={{
        width: `${gridSize}px`, // Dynamic width based on state
        height: `${gridSize}px`, // Dynamic height to maintain aspect ratio
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1, // Adjust as needed
        margin: "0 auto", // Center the grid horizontally with auto margins
      }}
    >
      {cellValues.map((cellValue, index) => (
        <TicTacToeCell
          key={index}
          cellNumber={index}
          cellValue={cellValue}
          onCellClick={handleCellClick}
        />
      ))}
    </Box>
  );
};

export default TicTacToeGrid;
