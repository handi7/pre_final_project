import "../assets/styles/MyNavbar.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import React from "react";
import { API_URL } from "../constants/API";
import { logoutUser } from "../redux/actions/user";
import { useDispatch, useSelector } from "react-redux";

function MyNavbar() {
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let profileimgUrl = `${API_URL}/profile-img/${userGlobal.profileImg}`;
  let profileImg = userGlobal.profileImg
    ? profileimgUrl
    : require("../assets/images/main/main-profile.png");

  return (
    <div className="main-container border-bottom position-fixed fixed-top">
      <div className="sec-container">
        <div>
          <a href="/" className="text-white">
            <img
              className="logo"
              src={require("../assets/images/main/capture-logo.png")}
              alt="logo"
            />
          </a>
        </div>

        <div className="d-flex flex-row align-items-center">
          <div className="dropdown">
            {userGlobal.isVerified ? null : (
              <span className=" text-warning me-1">
                <i className="fa fa-exclamation" /> Unverified
              </span>
            )}
            <span className="h6">
              {userGlobal.firstName} {userGlobal.lastName}{" "}
              <img
                className="toggle-img rounded-circle"
                src={profileImg}
                alt="profile"
              />
            </span>
            <div className="dropdown-content text-center">
              <a className="w-100" href={`/profile/${userGlobal.id}`}>
                <div className="item w-100 mb-2">Profile</div>
              </a>
              <div className="border-top py-2">
                <button
                  onClick={() => dispatch(logoutUser())}
                  className="btn btn-sm btn-danger"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          {/* <div className="navbar-dropdown-container" tabIndex="-1">
            <div className="profile-toggle">
              <span className="h6">
                {userGlobal.firstName} {userGlobal.lastName}{" "}
              </span>
              <img
                className="toggle-img rounded-circle"
                src={require("../assets/images/main/main-profile.png")}
                alt="profile"
              />
            </div>

            <div className="navbar-dropdown">
              <a className="text-center" href={`/profile/${userGlobal.id}`}>
                <button className="btn-tr">Profile</button>
              </a>
              <button
                className="btn-logout text-white border mt-2"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MyNavbar;
