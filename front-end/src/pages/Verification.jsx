import { API_URL } from "../constants/API";
import Axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Verification() {
  const { token } = useParams();
  const [valid, setValid] = useState({});

  const verify = async () => {
    try {
      const checkLink = await Axios.get(`${API_URL}/user/checkLink/${token}`);
      console.log(checkLink.data);
      if (checkLink.data) {
        await Axios.patch(
          `${API_URL}/user/verified`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setValid({ valid: true, msg: "Your Account Verified." });
      } else {
        setValid({
          valid: false,
          msg: "Invalid link. Please check your newest email or try to resend verification mail.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <div>
      <div className="m-5 p-5">
        <div className="bg-white border d-flex flex-column align-items-center text-center p-5 m-5">
          <div>
            <img
              src={require("../assets/images/main/capture-logo-blue.png")}
              alt="brand"
              style={{ width: "200px", marginBottom: "30px" }}
            />
          </div>
          <h3 className="text-primary">Verification Page</h3>
          {valid.valid ? (
            <>
              <h5 className="text-success mt-5">{valid.msg}</h5>
              <a className="mt-3" href="/login">
                Login
              </a>
            </>
          ) : (
            <h5 className="text-danger mt-5">{valid.msg}</h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verification;
