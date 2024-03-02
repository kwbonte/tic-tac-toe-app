import React from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";

interface TicTacToeCellProps {
  cellNumber: number;
  cellValue: "X" | "O" | null;
  onCellClick: (cellNumber: number) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  // Remove paddingTop in favor of a different aspect ratio maintenance strategy
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)", // Example responsive font size that scales with the container
  userSelect: "none",
  cursor: "pointer",
  border: "1px solid #000", // Adjust as needed for your design
  "&:after": {
    // Maintain aspect ratio with a pseudo-element
    content: "''",
    display: "block",
    paddingBottom: "100%", // This will make the height equal to the width of the parent
  },
  "& > *": {
    // Direct children of the cell should be able to position themselves correctly now
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
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
