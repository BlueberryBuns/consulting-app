import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Redirect, useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { accountActions } from "../../stores/redux-store/slices/auth-slice";
import authAxios from "../../Auth/auth-axios";
import { useDispatch, useSelector } from "react-redux";
import ButtonLink from "../../components/Buttons/CustomLinkButton";

const loginHandler = async (email, password) => {
  console.log("Sent user login data");
  const res = await authAxios.post("/api/login/", {
    email: email,
    password: password,
  });
  return res;
};

const registerHandler = async (
  email,
  password,
  confirmPassword,
  firstName,
  lastName
) => {
  console.log("Sent register data");
  const response = await authAxios.post("/api/register/", {
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
    password_confirmation: confirmPassword,
  });
  console.log(response);

  return response;
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
  const history = useHistory();
  const authState = useSelector((state) => state.account);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get("email");
    let password = data.get("password");
    let passwordConfirmation = data.get("passwordConfirmation");
    let firstName = data.get("firstName");
    let lastName = data.get("lastName");
    const registerResponse = await registerHandler(
      email,
      password,
      passwordConfirmation,
      firstName,
      lastName
    );
    if (registerResponse.status === 201) {
      console.log("Tried logging in after register");
      const loginAfterRegisterResponse = await loginHandler(email, password);
      dispatch(accountActions.updateTokens(loginAfterRegisterResponse.data));
      console.log(loginAfterRegisterResponse);
      history.push("/");
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
            Rejestracja
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 0 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstNameInputRegister"
              label="Imię"
              name="firstName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastNameInputRegister"
              label="Nazwisko"
              name="lastName"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="emailRegister"
              label="Adres email"
              name="email"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Hasło"
              type="password"
              id="passwordRegister"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordConfirmation"
              label="Potwierdzenie hasła"
              type="password"
              id="passwordConfirmationRegister"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 0 }}
            >
              Zarejestruj się
            </Button>
            <ButtonLink
              to={"/login"}
              text={"Masz już konto? Zaloguj się!"}
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
