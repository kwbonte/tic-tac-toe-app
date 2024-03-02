import React, { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";

// Cell style
const CellStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: theme.palette.text.secondary,
  aspectRatio: "1 / 1",
  outline: "none",
  boxShadow: "none",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "red",
    cursor: "pointer",
  },
}));

interface CellProps {
  id: number;
  currentTurn: string; // Add a value prop
  disabled: boolean;
  resetFlag: boolean;
  onClick: (id: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  id,
  currentTurn,
  disabled,
  resetFlag,
  onClick,
}) => {
  const [cellValue, setCellvalue] = useState("");
  // Use an effect to listen for changes to resetFlag
  useEffect(() => {
    // Reset cellValue when resetFlag changes
    setCellvalue("");
  }, [resetFlag]); // Listen for changes to resetFlag

  const handleClick = async () => {
    if (!disabled) {
      try {
        await onClick(id);
        console.log("onclick succeeded", id, currentTurn);
        setCellvalue(currentTurn);
      } catch (err: any) {
        console.error(err);
      }
    }
  };
  return (
    <CellStyled
      onClick={handleClick}
      style={{ pointerEvents: disabled ? "none" : undefined }}
    >
      {cellValue} {/* Display the value here */}
    </CellStyled>
  );
};
