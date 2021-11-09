import { useRef, useState } from "react";
import authAxios from "../../Auth/auth-axios";
import { useSelector, useDispatch } from "react-redux";
import { accountActions } from "../../stores/redux-store/slices/auth-slice";
import { Redirect } from "react-router";

const loginHandler = async (email, password) => {
  console.log("Sent user login data");
  const res = await authAxios.post("/users/login", {
    email: email,
    password: password,
  });
  return res;
};

const registerHandler = async (
  email,
  password,
  confirmPassword,
  firstName,
  middleName,
  lastName
) => {
  console.log("Sent register data");
  const response = await authAxios.post("/users/register", {
    email: email,
    password: password,
    password_confirmation: confirmPassword,
    first_name: firstName,
    middle_names: middleName,
    last_name: lastName,
  });
  console.log(response);

  return response;
};

const AccountPage = (props) => {
  const dispatch = useDispatch();
  // Starts with login
  const [accountToggle, setAccountToggle] = useState(false);
  const authState = useSelector((store) => store.account);

  // Login / SignUp
  const emailRef = useRef();
  const passwordRef = useRef();

  // Signup Only
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const passwordConfirmationRef = useRef();

  const switchToggle = () => {
    setAccountToggle((previosState) => !previosState);
  };

  const submitLoginHander = async (event) => {
    event.preventDefault();
    const passwd = passwordRef.current.value;
    const email = emailRef.current.value;

    if (!accountToggle) {
      try {
        const response = await loginHandler(email, passwd);
        if (response.statusText === "OK") {
          dispatch(accountActions.updateTokens(response.data));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const passwdConf = passwordConfirmationRef.current.value;
      const firstName = firstNameRef.current.value;
      const middleName = middleNameRef.current.value;
      const lastName = lastNameRef.current.value;

      try {
        const registerResponse = await registerHandler(
          email,
          passwd,
          passwdConf,
          firstName,
          middleName,
          lastName
        );
        if (registerResponse.status === 201) {
          console.log("Tried logging in after register");
          const loginAfterRegisterResponse = await loginHandler(email, passwd);
          dispatch(
            accountActions.updateTokens(loginAfterRegisterResponse.data)
          );
          console.log(loginAfterRegisterResponse);
        }
        // console.log(registerResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {authState.isAuthenticated && <Redirect to="/camera" />}
      {console.log(authState)}
      <form onSubmit={submitLoginHander}>
        <div>
          <label htmlFor="email">Your email</label>
          <input type="email" id="email" required ref={emailRef}></input>
        </div>
        <div>
          <label htmlFor="password">Your password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordRef}
          ></input>
        </div>
        {accountToggle && (
          <>
            <div>
              <label htmlFor="password-conf">Confirm your password</label>
              <input
                type="password"
                id="password-conf"
                required
                ref={passwordConfirmationRef}
              ></input>
            </div>
            <div>
              <label htmlFor="name">first name</label>
              <input type="name" id="name" required ref={firstNameRef}></input>
            </div>
            <div>
              <label htmlFor="mid-name">middle name</label>
              <input type="name" id="mid-name" ref={middleNameRef}></input>
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="name"
                id="last-name"
                required
                ref={lastNameRef}
              ></input>
            </div>
          </>
        )}
        <button type="submit">{accountToggle ? "Sign Up" : "Sign In"}</button>
      </form>
      <a onClick={switchToggle}>
        {accountToggle
          ? "Already have an account? sign in"
          : "New here? Register now"}
      </a>
    </>
  );
};

export default AccountPage;
