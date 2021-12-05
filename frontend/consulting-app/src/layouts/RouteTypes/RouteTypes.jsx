import { useSelector } from "react-redux";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { PatientModule } from "../Application/PatientModule";

const PatientRoutes = ({ component: Component, ...rest }) => {
  const authState = useSelector((state) => state.account);
  return (
    <Route
      {...rest}
      render={(props) =>
        authState.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

// const PatientRoute = (props) => {
//   const authState = useSelector((state) => state.account);
//   console.log(props);
//   return (
//     <div>XD</div>
//     // <Route
//     //   {...props}
//     //   render={(props) => {
//     //     return (
//     //       <div>Not working</div>
//     //       // <Redirect
//     //       //   to={{ pathname: "/login", state: { from: props.location } }}
//     //       // />
//     //     );
//     //     // return <RenderedComponent {...props} />;
//     //   }}
//     // />
//   );
// };
const DoctorRoutes = ({ component: Component, ...rest }) => {
  const authState = useSelector((state) => state.account);
  return (
    <Route
      {...rest}
      render={(props) =>
        authState.isDoctor | authState.isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};
const ModeratorRoutes = ({ component: Component, ...rest }) => {
  const authState = useSelector((state) => state.account);
  return (
    <Route
      {...rest}
      render={(props) =>
        authState.isModerator | authState.isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const AdminRoutes = ({ component: Component, ...rest }) => {
  const authState = useSelector((state) => state.account);
  return (
    <Route
      {...rest}
      render={(props) =>
        authState.isAdmin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
export { PatientRoutes, DoctorRoutes, ModeratorRoutes, AdminRoutes };
