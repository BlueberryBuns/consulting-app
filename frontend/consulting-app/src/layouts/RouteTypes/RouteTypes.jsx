import { useSelector } from "react-redux";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";

const PatientRoute = ({ component: RenderedComponent, ...rest }) => {
  const authState = useSelector((state) => state.account);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authState.isAuthenticated) {
          console.log("pacjent");
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        return <RenderedComponent {...props} />;
      }}
    />
  );
};
const DoctorRoute = ({ component: RenderedComponent, ...rest }) => {
  const authState = useSelector((state) => state.account);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authState.isDoctor) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        return <RenderedComponent {...props} />;
      }}
    />
  );
};
const ModeratorRoute = ({ component: RenderedComponent, ...rest }) => {
  const authState = useSelector((state) => state.account);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!(authState.isModerator && authState.isAdmin)) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        return <RenderedComponent {...props} />;
      }}
    />
  );
};

const AdminRoute = ({ component: RenderedComponent, ...rest }) => {
  const authState = useSelector((state) => state.account);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authState.isAdmin) {
          return (
            <Redirect
              to={{ pathname: "/patient", state: { from: props.location } }}
            />
          );
        }
        return <RenderedComponent {...props} />;
      }}
    />
  );
};
export { PatientRoute, DoctorRoute, ModeratorRoute, AdminRoute };
