import "../../assets/styles/Login.css";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/actions/user";
import { Spinner } from "react-bootstrap";

function Login() {
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const state = {
    uNameOrEmail: "",
    password: "",
  };

  const [dataLogin, setDataLogin] = useState(state);
  const [passType, setPassType] = useState("password");
  const [complete, setComplete] = useState(false);

  const inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setDataLogin({ ...dataLogin, [name]: value });
  };

  const togglePassword = () => {
    if (passType === "password") {
      setPassType("text");
    } else {
      setPassType("password");
    }
  };

  useEffect(() => {
    if (!dataLogin.uNameOrEmail || !dataLogin.password) {
      setComplete(false);
    } else {
      setComplete(true);
    }
  }, [{ ...dataLogin }]);

  if (userGlobal.id) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <div className="container rounded p-2">
        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="col-sm p-3">
          <div>
            <div className="head text-end">
              <button className="login-login">Login</button>
              <Link to="/register">
                <button className="login-register">Register</button>
              </Link>
            </div>
          </div>

          <div className="px-5">
            <div>
              <div className="mt-2" style={{ height: "62px" }}>
                {userGlobal.errMsg && (
                  <div className="alert alert-danger rounded py-1 ">
                    {userGlobal.errMsg}
                  </div>
                )}
              </div>

              <div>
                <div className="card-body">
                  <div>
                    <label>Email or Username:</label>
                    <div className="d-flex position-relative align-items-center">
                      <span className="fa fa-at position-absolute ps-3 pb-3 text-secondary" />
                      <input
                        onChange={inputHandler}
                        name="uNameOrEmail"
                        placeholder="Email or Username"
                        type="text"
                        className="form-control mb-3 ps-5"
                      />
                    </div>
                  </div>

                  <div>
                    <label>Password:</label>
                    <div className="d-flex position-relative align-items-center">
                      <span className="fa fa-key position-absolute ps-3 text-secondary" />
                      <input
                        onChange={inputHandler}
                        name="password"
                        placeholder="Password"
                        type={passType}
                        className="form-control ps-5"
                      />
                      <button
                        onClick={togglePassword}
                        className="eye text-secondary"
                      >
                        {passType === "password" ? (
                          <i className="fa fa-eye-slash pe-2" />
                        ) : (
                          <i className="fa fa-eye pe-2" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="remember d-flex justify-content-end my-3">
                    <a href="/forgot-password">Forgot Password?</a>
                  </div>

                  <div>
                    <button
                      disabled={userGlobal.loading || !complete}
                      onClick={() => dispatch(loginUser(dataLogin))}
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
                          {` Logging in...`}
                        </>
                      ) : (
                        <>Login</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
