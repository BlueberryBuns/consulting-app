import { Fragment } from "react";
import { Redirect } from "react-router-dom";

const RestrictedView = (props) => {
  let isAuth = false;
  const classes = props.className;

  return isAuth ? (
    <Fragment className={classes}>{props.children}</Fragment>
  ) : (
    <Redirect to="/login" />
  );
};

export default RestrictedView;
