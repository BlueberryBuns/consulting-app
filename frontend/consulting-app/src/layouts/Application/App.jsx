import authAxios from "../../Auth/auth-axios";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { useEffect } from "react";
import { accountActions } from "../../stores/redux-store/slices/auth-slice";

const App = (props) => {
  const authState = useSelector((state) => state.account);
  const dispatch = useDispatch();
  console.log("User authenticated: ", authState.isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.isAuthenticated) {
        if (authState.accessToken) {
          try {
            const response = await authAxios.post("/users/token/verify", {
              token: authState.accessToken,
            });
            if (response.statusText === "OK") {
              console.log(response);
              console.log("Saved token is valid, authorising user");
              dispatch(accountActions.updateIsAuthenticated());
              return;
            }
          } catch (err) {
            console.log(err);
            try {
              const responseRefresh = await authAxios.post(
                "/users/token/refresh",
                {
                  refresh: authState.refreshToken,
                }
              );

              // Rotate access and refresh tokens
              console.log(responseRefresh);
              console.log("Refreshed Token");
              dispatch(accountActions.updateTokens(responseRefresh.data));
            } catch (error) {
              console.log(error);
              dispatch(accountActions.logout());
            }
          }
        }
      }
    };

    fetchData();
    // return () => {
    //   cleanup;
    // };
  }, []);
  return (
    <div>
      Not Aauthenticated
      {authState.isAuthenticated && <div>Not now buddy c:</div>}
    </div>
  );
};

export default App;
