import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import MedService from "@mui/icons-material/MedicalServices";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const NavBar = () => {
  let history = useHistory();
  const redirectToLogin = () => {
    history.push("/login");
  };
  const authState = useSelector((state) => state.account);
  return (
    <AppBar position="relative" style={{ background: "purple" }}>
      <Toolbar>
        <MedService sx={{ mr: 2 }} />
        <Typography variant="h5" color="inherit" noWrap style={{ flex: 1 }}>
          Consulting Application
        </Typography>
        {!authState.isAuthenticated ? (
          <Button color="inherit" onClick={redirectToLogin}>
            Sign up
          </Button>
        ) : (
          <div>Użytkownik...</div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
