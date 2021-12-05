import { Route } from "react-router";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import LandingPage from "./LandingPage";
const UnauthorisedModule = () => {
  return (
    <>
      <Route exact path="/" render={(props) => <LandingPage />} />
      <Route
        exact
        path="/login"
        render={(props) => <LoginPage {...props} />} //<LandingPageTMP {...props} />}
      />
      <Route
        exact
        path="/register"
        render={(props) => <RegisterPage {...props} />} //<LandingPageTMP {...props} />}
      />
      <Route
        exact
        path="/doctors"
        render={(props) => <div>Doctors</div>} //<LandingPageTMP {...props} />}
      />
    </>
  );
};

export default UnauthorisedModule;
