import Axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { API_URL } from "../constants/API";
import { Spinner } from "react-bootstrap";

export default function ResetPassword() {
  const { token } = useParams();

  const [data, setData] = useState({});
  const [valid, setValid] = useState(true);
  const [password, setPassword] = useState({});
  const [msg, setMsg] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [toggle, setToggle] = useState({
    password: "password",
    repeat: "password",
  });

  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const passwordIsValid = pattern.test(password.password);

  const checkLink = async () => {
    try {
      const response = await Axios.get(`${API_URL}/user/checkLink/${token}`);
      if (response.data) {
        delete response.data.password;
        setData(response.data);
      } else {
        setValid(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reset = async () => {
    try {
      setSending(true);
      const { id } = data;
      if (!password.password) {
        setMsg({ empty: "Fill the form!" });
        setSending(false);
      } else {
        await Axios.patch(`${API_URL}/user/reset`, {
          id,
          password: password.password,
        });
        setSending(false);
        setDone(true);
      }
    } catch (error) {
      console.log(error);
      setSending(false);
    }
  };

  const passwordToggle = (prop) => {
    if (prop === "rep") {
      if (toggle.repeat === "password") {
        setToggle({ ...toggle, repeat: "text" });
      } else {
        setToggle({ ...toggle, repeat: "password" });
      }
    } else {
      if (toggle.password === "password") {
        setToggle({ ...toggle, password: "text" });
      } else {
        setToggle({ ...toggle, password: "password" });
      }
    }
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setPassword({ ...password, [name]: value });
  };

  useEffect(() => {
    if (password.password && !passwordIsValid) {
      setMsg({
        ...msg,
        password: "6-15 char included letter & number with no special char.",
      });
    } else {
      setMsg({ ...msg, password: "" });
    }
  }, [password.password]);

  useEffect(() => {
    if (password.repeat && password.repeat !== password.password) {
      setMsg({ ...msg, repeat: "Password didn't match" });
    } else {
      setMsg({ ...msg, repeat: "" });
    }
  }, [password.repeat]);

  useEffect(() => {
    checkLink();
  }, []);

  return (
    <div>
      <div className="m-5 p-5">
        <div className="bg-white border d-flex flex-column align-items-center p-5 m-5">
          <div>
            <img
              src={require("../assets/images/main/capture-logo-blue.png")}
              alt="brand"
              style={{ width: "200px", marginBottom: "30px" }}
            />
          </div>

          <h3 className="text-primary">Reset Password</h3>

          {!valid && (
            <>
              <h5 className="text-danger mt-5">
                Reset password link not valid!
              </h5>
              <p>
                Check your newest mail or try to resend new reset password
                request.
              </p>
            </>
          )}

          {valid && !done && (
            <div className="border rounded p-3">
              <div>
                <span className="text-danger">{msg.empty}</span>
              </div>

              <div>
                <label>New password</label>
                <div className="d-flex position-relative align-items-center">
                  <input
                    onChange={inputHandler}
                    type={toggle.password}
                    name="password"
                    placeholder="New password"
                    className="form-control"
                  />
                  <button
                    onClick={() => passwordToggle("pas")}
                    className="eye text-secondary"
                  >
                    {toggle.password === "password" ? (
                      <i className="fa fa-eye-slash pe-2" />
                    ) : (
                      <i className="fa fa-eye pe-2" />
                    )}
                  </button>
                </div>
                {msg.password && <p className="text-danger">{msg.password}</p>}
              </div>

              <div className="mt-3">
                <label>Repeat new password</label>
                <div className="d-flex position-relative align-items-center">
                  <input
                    onChange={inputHandler}
                    type={toggle.repeat}
                    name="repeat"
                    placeholder="Repeat new password"
                    className="form-control"
                  />
                  <button
                    onClick={() => passwordToggle("rep")}
                    className="eye text-secondary"
                  >
                    {toggle.repeat === "password" ? (
                      <i className="fa fa-eye-slash pe-2" />
                    ) : (
                      <i className="fa fa-eye pe-2" />
                    )}
                  </button>
                </div>
                {msg.repeat && <p className="text-danger">{msg.repeat}</p>}
              </div>

              <button
                disabled={
                  msg.password ||
                  (password.password &&
                    password.password !== password.repeat) ||
                  sending
                }
                onClick={reset}
                className="btn btn-primary mt-2"
              >
                {sending ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {` sending...`}
                  </>
                ) : (
                  "Reset"
                )}
              </button>
            </div>
          )}

          {done && valid && (
            <div className="text-center">
              <span className="text-success">Successfully reset</span>
              <div>
                <a href="/login">
                  <button className="btn btn-primary">Login</button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
