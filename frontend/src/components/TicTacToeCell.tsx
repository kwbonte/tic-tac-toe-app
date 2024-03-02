import React from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";

interface TicTacToeCellProps {
  cellNumber: number;
  cellValue: "X" | "O" | null;
  onCellClick: (cellNumber: number) => void;
}

const StyledPaper = styled(Paper)({
  width: "100%",
  paddingTop: "100%", // Maintain aspect ratio to make it square
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2em",
  userSelect: "none",
  cursor: "pointer",
  border: "1px solid #000", // Adjust as needed for your design
});

const TicTacToeCell: React.FC<TicTacToeCellProps> = ({
  cellNumber,
  cellValue,
  onCellClick,
}) => {
  return (
    <StyledPaper onClick={() => onCellClick(cellNumber)} elevation={0}>
      {cellValue}
    </StyledPaper>
  );
};

export default TicTacToeCell;
