import { AppBar, Toolbar, Typography } from "@mui/material";
import MedService from "@mui/icons-material/MedicalServices";

const NavBar = () => {
  return (
    <AppBar position="relative" style={{ background: "purple" }}>
      <Toolbar>
        <MedService sx={{ mr: 2 }} />
        <Typography variant="h5" color="inherit" noWrap>
          Consulting Application
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
