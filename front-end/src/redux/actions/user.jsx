import Axios from "axios";
import { API_URL } from "../../constants/API";
import Swal from "sweetalert2";

export const registerUser = (data) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });
    try {
      const result = await Axios.post(`${API_URL}/user/register`, data);

      if (typeof result.data === "string") {
        if (result.data.includes("username")) {
          dispatch({
            type: "UNAME_ERR",
            payload: "Username already exist.",
          });
        } else {
          dispatch({
            type: "UNAME_ERR",
            payload: "",
          });
        }

        if (result.data.includes("email")) {
          dispatch({
            type: "MAIL_ERR",
            payload: "Email already registered.",
          });
        } else {
          dispatch({
            type: "MAIL_ERR",
            payload: "",
          });
        }
      } else {
        const dataLogin = result.data.dataLogin;
        delete dataLogin.password;
        localStorage.setItem("userDataCapture", result.data.token);
        dispatch({
          type: "USER_LOGIN",
          payload: dataLogin,
        });

        Swal.fire({
          text: "Register success! Check and verify your email.",
          position: "top",
        });
      }
    } catch (error) {
      dispatch({
        type: "LOADING",
        payload: false,
      });
      console.log(error);
    }
  };
};

export const loginUser = ({ uNameOrEmail, password }) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await Axios.post(`${API_URL}/user/login`, {
        uNameOrEmail,
        password,
      });

      if (typeof response.data === "string") {
        dispatch({
          type: "USER_ERROR",
          payload: response.data,
        });
      } else {
        delete response.data.data.password;
        localStorage.setItem("userDataCapture", response.data.token);

        dispatch({
          type: "USER_LOGIN",
          payload: response.data.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "LOADING",
        payload: false,
      });
      console.log(error);
    }
  };
};

export const logoutUser = () => {
  try {
    localStorage.removeItem("userDataCapture");
    return {
      type: "USER_LOGOUT",
    };
  } catch (error) {
    console.log(error);
  }
};

export const userKeepLogin = (token) => {
  return async (dispatch) => {
    try {
      const response = await Axios.post(`${API_URL}/user/keepLogin`, {
        token: token,
      });

      delete response.data.data.password;
      localStorage.setItem("userDataCapture", response.data.token);

      dispatch({
        type: "USER_LOGIN",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const checkStorage = () => {
  return {
    type: "CHECK_STORAGE",
  };
};
