import { Redirect, useLocation } from "react-router-dom";
import UnestrictedView from "../LayoutTypes/Unrestricted";

const LoginPage = (props) => {
  return (
    <UnestrictedView>
      <h2>
        Ta strona nie powinna się pojawić, zamiast tego powininen być home
      </h2>
    </UnestrictedView>
  );
};

export default LoginPage;
