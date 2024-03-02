import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  aspectRatio: "1 / 1", // Ensure the item is always square
  border: `1px solid ${theme.palette.divider}`, // Apply border
}));

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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledGridContainer
        container
        spacing={{ xs: 0.5, md: 0.5 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Array.from(Array(9)).map((_, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Item>x</Item>
          </Grid>
        ))}
      </StyledGridContainer>
    </Box>
  );
}
