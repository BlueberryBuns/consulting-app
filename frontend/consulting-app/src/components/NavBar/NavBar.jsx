import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Hidden,
  Button,
  Paper,
} from "@mui/material";
import React from "react";
import MedService from "@mui/icons-material/MedicalServices";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import ButtonLink from "../Buttons/CustomLinkButton";
import { useDispatch } from "react-redux";
import { accountActions } from "../../stores/redux-store/slices/auth-slice";
import LinkTypography from "./LinkTypography";
import { useEffect, useState } from "react";
import { SwipeableDrawer } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import { SliderButton } from "../Buttons/SliderPaperButton";
const NavBar = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.account);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    dispatch(accountActions.logout());
  };

  useEffect(() => {}, [authState.lastName]);

  const patientMenu = [
    {
      type: "button",
      restriction: "None",
      name: "Strona główna",
      url: "/",
    },
    {
      type: "button",
      name: "Moje wizyty",
      url: "/patient/visits",
    },
    {
      type: "button",
      name: "Umów wizytę",
      url: "/patient/meeting/browse-doctors",
    },
  ];

  const doctorMenu = [
    {
      type: "button",
      name: "Zarządzaj wizytami",
      url: "/doctor/visits",
    },
  ];

  return (
    <AppBar position="relative" style={{ background: "purple" }}>
      <Toolbar>
        <MedService sx={{ mr: 2 }} />
        {/* <Typography variant="h5" color="inherit" noWrap style={{ flex: 1 }}>
          Consulting Application
        </Typography> */}
        <Hidden smDown>
          <LinkTypography
            to={"/"}
            text={"Aplikacja do konsultacji"}
            sx={{ textDecoration: "none" }}
            variant="h5"
            color="inherit"
            style={{ fontWeight: 600 }}
            noWrap
            // style={{ flex: 2 }}
          />
        </Hidden>
        <Hidden smUp>
          <LinkTypography
            to={"/"}
            text={"ADK"}
            sx={{ textDecoration: "none" }}
            variant="h5"
            color="inherit"
            style={{ fontWeight: 600 }}
            noWrap
            // style={{ flex: 2 }}
          />
        </Hidden>
        <Box sx={{ flexGrow: 1 }} />

        {!authState.isAuthenticated ? (
          <>
            <ButtonLink
              to={"/login"}
              text={"Zaloguj"}
              color={"inherit"}
              style={{ fontWeight: 600 }}
            ></ButtonLink>
          </>
        ) : (
          <>
            <Hidden smDown>
              <Typography
                style={{
                  fontWeight: 600,
                  paddingRight: "30px",
                }}
              >
                {authState.firstName} {authState.lastName}
              </Typography>
              {patientMenu.map((item) => (
                <ButtonLink
                  to={item.url}
                  text={item.name}
                  style={{ fontWeight: 600 }}
                  color="inherit"
                ></ButtonLink>
              ))}
              <ButtonLink
                to={"/"}
                text={"Wyloguj"}
                style={{ fontWeight: 600 }}
                color="inherit"
                onClick={handleLogout}
              ></ButtonLink>
            </Hidden>
            <Hidden smUp>
              <IconButton>
                <MenuIcon onClick={() => setMenuOpen(true)} />
              </IconButton>
            </Hidden>
          </>
        )}
      </Toolbar>
      {authState.isAuthenticated ? (
        <SwipeableDrawer
          anchor="right"
          open={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
        >
          <div>
            <IconButton>
              <ChevronRightIcon onClick={() => setMenuOpen(false)} />
            </IconButton>
          </div>
          <Typography style={{ fontWeight: 600 }} textAlign="center">
            {authState.firstName} {authState.lastName}
          </Typography>

          {patientMenu.map((item) => (
            <SliderButton to={item.url} text={item.name}></SliderButton>
          ))}
          <Paper
            elevation={0}
            sx={{
              borderBottom: "1px solid black",
              borderRadius: "0 0 0 0 !important",
              display: "grid",
              placeItems: "center",
              paddingTop: "30px",
            }}
          >
            <Typography sx={{ paddingBottom: "3px", fontWeight: 600 }}>
              Doctor
            </Typography>
          </Paper>
          {doctorMenu.map((item) => (
            <SliderButton to={item.url} text={item.name}></SliderButton>
          ))}
          <Button
            sx={{ borderRadius: "0 0 0 0 !important" }}
            color="error"
            variant={"contained"}
            onClick={handleLogout}
          >
            Wyloguj
          </Button>
        </SwipeableDrawer>
      ) : (
        <></>
      )}
    </AppBar>
  );
};

export default NavBar;
