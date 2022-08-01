const init_state = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  id: 0,
  errMsg: "",
  unameErr: "",
  mailErr: "",
  loading: false,
  storageIsChecked: false,
};

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        ...action.payload,
        storageIsChecked: true,
        loading: true,
      };

    case "USER_LOGOUT":
      return { ...init_state, storageIsChecked: true };

    case "USER_ERROR":
      return { ...state, errMsg: action.payload, loading: false };

    case "CHECK_STORAGE":
      return { ...state, storageIsChecked: true };

    case "LOADING":
      return { ...state, loading: action.payload };

    case "UNAME_ERR":
      return { ...state, unameErr: action.payload, loading: false };

    case "MAIL_ERR":
      return { ...state, mailErr: action.payload, loading: false };

    default:
      return state;
  }
};

export default reducer;
