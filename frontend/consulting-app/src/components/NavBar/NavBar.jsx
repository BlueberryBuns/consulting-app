import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Hidden,
  Divider,
  List,
  Button,
  ListItem,
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

const NavBar = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.account);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    dispatch(accountActions.logout());
  };

  useEffect(() => {}, [authState.lastName]);

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
            style={{ textDecoration: "none" }}
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
            style={{ textDecoration: "none" }}
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
              <Typography style={{ fontWeight: 600 }}>
                {authState.firstName} {authState.lastName}
              </Typography>
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
          <Divider />
          <List>
            <ListItem>
              <Link to="/">Home</Link>
            </ListItem>
            <ListItem>
              <Link to="/">Przeglądaj lekarzy</Link>
            </ListItem>
            <ListItem>
              <Link to="/">Umówione wizyty</Link>
            </ListItem>
            <ListItem>
              <Link to="/">Umów wizytę</Link>
            </ListItem>
            {authState.isDoctor | authState.isAdmin ? (
              <>
                <Divider />
                <Typography style={{ fontWeight: 600 }} textAlign="center">
                  Panel Lekarza
                </Typography>
                <ListItem>
                  <Link to="/">Zarządzaj wizytami</Link>
                </ListItem>
              </>
            ) : (
              <></>
            )}
            {authState.isModerator | authState.isAdmin ? (
              <>
                <Divider />
                <Typography style={{ fontWeight: 600 }} textAlign="center">
                  Panel Moderatora
                </Typography>
                <ListItem>
                  <Link to="/">Zarządzaj wizytami</Link>
                </ListItem>
                <ListItem>
                  <Link to="/">Dodaj wizytę</Link>
                </ListItem>
                <ListItem>
                  <Link to="/">Dodaj lekarza</Link>
                </ListItem>
              </>
            ) : (
              <></>
            )}
            {authState.isAdmin ? (
              <>
                <Divider />
                <Typography style={{ fontWeight: 600 }} textAlign="center">
                  Panel Admina
                </Typography>
                <ListItem>
                  <Link to="/">Dodaj Moderatora</Link>
                </ListItem>
              </>
            ) : (
              <></>
            )}
            <Divider />
            <ListItem>
              <Button
                color="error"
                variant={"contained"}
                onClick={handleLogout}
              >
                Wyloguj
              </Button>
            </ListItem>
          </List>
        </SwipeableDrawer>
      ) : (
        <></>
      )}
    </AppBar>
  );
};

export default NavBar;
