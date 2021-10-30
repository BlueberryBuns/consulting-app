import authAxios from "../../Auth/auth-axios";

import { Redirect } from "react-router-dom";

const App = (props) => {
  return !localStorage.getItem("access_token") ? (
    <h1>Home</h1>
  ) : (
    <>
      <h1>RestrictedView</h1>
    </>
  );
};

export default App;
