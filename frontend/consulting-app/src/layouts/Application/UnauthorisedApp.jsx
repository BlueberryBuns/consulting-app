import { Route } from "react-router";
import LoginPage from "../UnrestrictedViews/LoginPage";
import RegisterPage from "../UnrestrictedViews/RegisterPage";
import LandingPage from "../UnrestrictedViews/LandingPage";

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
