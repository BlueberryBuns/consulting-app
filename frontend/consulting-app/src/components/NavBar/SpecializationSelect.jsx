import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const SelectSpecs = (props) => {
  return (
    <FormControl sx={{ marginTop: "15px", display: "grid" }}>
      <InputLabel id="demo-simple-select-helper-label">
        Specjalizacja
      </InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={props.spec}
        label="Specjalizacja"
        onChange={props.selectSpecialization}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {props.list.map((specialization) => (
          <MenuItem value={specialization.id}>
            {specialization.specialization}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
