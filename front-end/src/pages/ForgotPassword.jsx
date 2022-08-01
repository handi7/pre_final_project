import Axios from "axios";
import { useState } from "react";
import { Spinner } from "reactstrap";
import { API_URL } from "../constants/API";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({});
  const [loading, setLoading] = useState(false);

  const sendReset = async () => {
    try {
      setLoading(true);
      const response = await Axios.post(`${API_URL}/user/sendReset`, { email });

      setMsg(response.data);
      setLoading(false);
      setEmail("");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const inputHandler = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="login-container">
      <div className="container rounded p-2" style={{ width: "450px" }}>
        {/* <div className="col-sm  border-end"></div> */}

        <div className="col-sm p-3">
          <div className="px-5">
            <div>
              <div className="text-center mb-5">
                <img
                  style={{ width: "200px" }}
                  src={require("../assets/images/main/capture-logo-blue.png")}
                  alt="logo"
                />
              </div>
              <div>
                <h3>Reset Password</h3>
              </div>
              <div className="card-body">
                <div>
                  {msg.success && (
                    <span className="text-success">{msg.success}</span>
                  )}
                  {msg.error && (
                    <span className="text-danger">{msg.error}</span>
                  )}
                </div>
                <label>Email:</label>
                <div className="d-flex position-relative align-items-center">
                  <span className="fa fa-at position-absolute ps-3 pb-3 text-secondary" />
                  <input
                    onChange={inputHandler}
                    value={email}
                    placeholder="Email"
                    type="text"
                    className="form-control mb-3 ps-5"
                  />
                </div>

                <div>
                  <button
                    disabled={loading || !email}
                    onClick={sendReset}
                    className="btn btn-primary mt-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          variant="info"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {` Sending...`}
                      </>
                    ) : (
                      <>Send</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
