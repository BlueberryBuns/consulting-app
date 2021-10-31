import { Fragment } from "react";
import { Redirect } from "react-router-dom";
import authAxios from "../../Auth/auth-axios";

import axiosInstance from "../../Auth/auth-axios";

const RestrictedView = (props) => {
  //   authAxios.post("/users/token/verify");

  let isAuth = false;
  const classes = props.className;

  return isAuth ? (
    <Fragment className={classes}>{props.children}</Fragment>
  ) : (
    <Redirect to="/login" />
  );
};

export default RestrictedView;
