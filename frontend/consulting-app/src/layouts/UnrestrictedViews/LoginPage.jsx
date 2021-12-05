import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Redirect, useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import authAxios from "../../Auth/auth-axios";
import { useDispatch } from "react-redux";
import { accountActions } from "../../stores/redux-store/slices/auth-slice";
import { useSelector } from "react-redux";
import ButtonLink from "../../components/Buttons/CustomLinkButton";

const loginHandler = async (email, password) => {
  console.log("Sent user login data");
  const res = await authAxios.post("/api/login/", {
    email: email,
    password: password,
  });
  return res;
};

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const theme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.account);
  let history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get("email");
    let password = data.get("password");

    console.log({
      email,
      password,
    });
    const response = await loginHandler(email, password);
    if (response.statusText === "OK") {
      dispatch(accountActions.updateTokens(response.data));
      console.log(response.data);
      history.push("/patient");
    }
  };

  return !authState.isAuthenticated ? (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Logowanie
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adres email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Hasło"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Zapamiętaj mnie"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 0 }}
            >
              Zaloguj się
            </Button>
            <ButtonLink
              to={"/register"}
              text={"Nie masz konta? Zarejestruj się!"}
              color="success"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
            />
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  ) : (
    <Redirect to="/patient" />
  );
}
