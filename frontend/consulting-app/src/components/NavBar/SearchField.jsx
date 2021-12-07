import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

export const SearchField = (props) => {
  return (
    <Paper
      onSubmit={props.onSubmit}
      component="form"
      sx={{
        p: "2px 4px",
        display: "grid",
        alignItems: "center",
        width: "fill",
        gridTemplateColumns: "89% 1% 10%",
      }}
    >
      <InputBase
        sx={{ ml: 1, flexGrow: 1 }}
        placeholder="Podaj imię i nazwisko"
        inputProps={{ "aria-label": "search doctor" }}
        name="docname"
        id="docname"
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
