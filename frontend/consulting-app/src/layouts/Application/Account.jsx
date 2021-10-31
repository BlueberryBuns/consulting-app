import { useRef, useState } from "react";
import authAxios from "../../Auth/auth-axios";

const AccountPage = (props) => {
  // Starts with login
  const [accountToggle, setAccountToggle] = useState(false);

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
        console.log("login");
        const response = await authAxios.post("/users/login", {
          email: email,
          password: passwd,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      const passwdConf = passwordConfirmationRef.current.value;
      const firstName = firstNameRef.current.value;
      const middleName = middleNameRef.current.value;
      const lastName = lastNameRef.current.value;

      try {
        console.log("register");
        const response = await authAxios.post("/users/register", {
          email: email,
          password: passwd,
          password_confirmation: passwdConf,
          first_name: firstName,
          middle_names: middleName,
          last_name: lastName,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
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
