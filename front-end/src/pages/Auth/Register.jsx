import "../../assets/styles/Register.css";
import "font-awesome/css/font-awesome.min.css";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../redux/actions/user";

function Register() {
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // INPUT DATA STATE
  const input_state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    repeat: "",
  };

  // LOCAL STATE
  const [inputData, setInputData] = useState(input_state); // ALL INPUT DATA STATE
  const [errMsg, setErrMsg] = useState({}); // ALL ERROR MESSAGE
  const [matchMsg, setMatchMsg] = useState(""); // ERROR REPEAT PASSWORD
  const [passType, setPassType] = useState("password"); // HIDE PASSWORD TOGGLE
  const [repType, setRepType] = useState("password"); // HIDE REPEAT PASSWORD TOGGLE
  const [complete, setComplete] = useState(false); // FORM COMPLETE STATUS

  // REGULAR EXPRESSION
  const firstNamePattern = /^([a-zA-Z]{3,})$/;
  const usernamePattern = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/;
  const emailPattern =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // INPUT VALIDATION WITH REGULAR EXPRESSION
  const validFirstName = firstNamePattern.test(inputData.firstName);
  const validUsername = usernamePattern.test(inputData.username);
  const validEmail = emailPattern.test(inputData.email);
  const validPassword = passwordPattern.test(inputData.password);

  // HIDE PASSWORD AND REPEAT PASSWORD TOGGLE
  const togglePassword = (e) => {
    if (e === "pass") {
      if (passType === "password") {
        setPassType("text");
      } else {
        setPassType("password");
      }
    } else {
      if (repType === "password") {
        setRepType("text");
      } else {
        setRepType("password");
      }
    }
  };

  // INPUT HANDLER
  const inputHandler = (event) => {
    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    if (!validFirstName && inputData.firstName) {
      setErrMsg({ firstName: "Min. 3 character." });
    } else {
      setErrMsg({ firstName: "" });
    }
  }, [validFirstName, inputData.firstName]);

  // HANDLE INVALID USERNAME
  useEffect(() => {
    if (!validUsername && inputData.username) {
      setErrMsg({
        username: "6-15 char included letter & number with no special char.",
      });
    } else {
      setErrMsg({ username: "" });
    }
  }, [validUsername, inputData.username]);

  // HANDLE INVALID EMAIL
  useEffect(() => {
    if (!validEmail && inputData.email) {
      setErrMsg({ email: "Email isn't valid." });
    } else {
      setErrMsg({ email: "" });
    }
  }, [validEmail, inputData.email]);

  // HANDLE INVALID PASSWORD
  useEffect(() => {
    if (!validPassword && inputData.password) {
      setErrMsg({
        password:
          "Min 8 char. included uppercase & lowercase letter, number, and symbol.",
      });
    } else {
      setErrMsg({ password: "" });
    }
  }, [validPassword, inputData.password]);

  // HANDLE UNMATCHED PASSWORD
  useEffect(() => {
    if (inputData.password && inputData.password !== inputData.repeat) {
      setMatchMsg("Email didn't match.");
    } else {
      setMatchMsg("");
    }
  }, [inputData.password, inputData.repeat]);

  useEffect(() => {
    if (
      !inputData.firstName ||
      errMsg.firstName ||
      !inputData.username ||
      errMsg.username ||
      !inputData.email ||
      errMsg.email ||
      !inputData.password ||
      errMsg.password ||
      !inputData.repeat ||
      matchMsg
    ) {
      setComplete(false);
    } else {
      setComplete(true);
    }
  }, [{ ...errMsg }]);

  if (userGlobal.id) {
    return <Navigate to="/" />;
  }

  return (
    <div className="reg-container">
      <div className="container rounded p-2">
        <div className="col-sm d-flex flex-column align-items-center border-end">
          <div className="logo mt-5">
            <img
              src={require("../../assets/images/main/capture-logo-blue.png")}
              alt="logo"
            />
          </div>

          <div className="banner">
            <img
              src={require("../../assets/images/main/banner.png")}
              alt="banner"
            />
          </div>

          <div className="w-100 secondary d-flex flex-column align-items-end">
            <img
              src={require("../../assets/images/main/secondary.png")}
              alt="banner"
            />
          </div>
        </div>
        <div className="col-sm p-3">
          <div>
            <div className="head text-end">
              <Link to="/login">
                <button className="reg-login">Login</button>
              </Link>
              <button className="reg-reg">Register</button>
            </div>
          </div>

          <div className="px-5 mt-3">
            <div className="card-body">
              <div className="d-flex position-relative align-items-center">
                <span className="fa fa-address-card-o position-absolute ps-3 text-secondary ">
                  {` *`}
                </span>
                <input
                  onChange={inputHandler}
                  className="form-control my-1 ps-5"
                  placeholder="First name"
                  name="firstName"
                  value={inputData.firstName}
                />
              </div>

              {errMsg.firstName && (
                <span className="text-danger">{errMsg.firstName}</span>
              )}

              <div className="d-flex position-relative align-items-center">
                <span className="fa fa-address-card-o position-absolute ps-3 text-secondary"></span>
                <input
                  onChange={inputHandler}
                  className="form-control my-1 ps-5"
                  placeholder="Last Name"
                  name="lastName"
                  value={inputData.lastName}
                />
              </div>

              <div className="d-flex position-relative align-items-center">
                <span className="fa fa-user-circle position-absolute ps-3 text-secondary">{` *`}</span>
                <input
                  onChange={inputHandler}
                  placeholder="Username"
                  className="form-control my-2 ps-5"
                  name="username"
                  value={inputData.username}
                />
              </div>

              {userGlobal.unameErr ? (
                <span className="text-danger">{userGlobal.unameErr}</span>
              ) : null}

              {errMsg.username ? (
                <span className="text-danger">{errMsg.username}</span>
              ) : null}

              <div className="d-flex position-relative align-items-center">
                <span className="fa fa-at position-absolute ps-3 text-secondary">{` *`}</span>
                <input
                  onChange={inputHandler}
                  placeholder="Email"
                  className="form-control my-2 ps-5"
                  name="email"
                  value={inputData.email}
                />
              </div>

              {userGlobal.mailErr ? (
                <span className="text-danger">{userGlobal.mailErr}</span>
              ) : null}

              {errMsg.email ? (
                <span className="text-danger">{errMsg.email}</span>
              ) : null}

              <div className="d-flex position-relative align-items-center">
                <span className="fa fa-key position-absolute ps-3 text-secondary">{` *`}</span>
                <input
                  type={passType}
                  onChange={inputHandler}
                  placeholder="Password"
                  className="form-control my-2 ps-5"
                  name="password"
                  value={inputData.password}
                />
                <button
                  onClick={() => togglePassword("pass")}
                  className="eye text-secondary"
                >
                  {passType === "password" ? (
                    <i className="fa fa-eye-slash pe-2" />
                  ) : (
                    <i className="fa fa-eye pe-2" />
                  )}
                </button>
              </div>

              {errMsg.password ? (
                <span className="text-danger">{errMsg.password}</span>
              ) : null}

              <div className="d-flex position-relative align-items-center">
                <span className="fa fa-key position-absolute ps-3 text-secondary">{` *`}</span>
                <input
                  type={repType}
                  onChange={inputHandler}
                  placeholder="Repeat Password"
                  className="form-control my-2 ps-5"
                  name="repeat"
                  value={inputData.repeat}
                />
                <button
                  onClick={() => togglePassword("rep")}
                  className="eye text-secondary"
                >
                  {repType === "password" ? (
                    <i className="fa fa-eye-slash pe-2" />
                  ) : (
                    <i className="fa fa-eye pe-2" />
                  )}
                </button>
              </div>

              {matchMsg ? (
                <span className="text-danger">{matchMsg}</span>
              ) : null}

              <div className="d-block text-end">
                <span className="fa text-danger">(*) Require</span>
              </div>

              <div className="d-flex flex-row justify-content-between align-items-center">
                <button
                  disabled={!complete || matchMsg || userGlobal.loading}
                  onClick={() => dispatch(registerUser(inputData))}
                  className="btn btn-primary btn-post mt-2"
                >
                  {userGlobal.loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        variant="info"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      {` loading...`}
                    </>
                  ) : (
                    <>Register</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
