import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
// import MyNavbar from "./components/MyNavbar";
import WithNav from "./components/WithNav";
import WithoutNav from "./components/WithoutNav";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import PostDetail from "./pages/PostDetail";
import ErrorPage from "./pages/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { userKeepLogin, checkStorage } from "./redux/actions/user";

function App() {
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("userDataCapture");
    if (token) {
      // const userData = JSON.parse(userLocalStorage);
      dispatch(userKeepLogin(token));
    } else {
      dispatch(checkStorage());
    }
  }, []);

  if (userGlobal.storageIsChecked) {
    return (
      <div>
        <Router>
          <Routes>
            <Route element={<WithoutNav />}>
              <Route element={<Login />} path="/login" />
              <Route element={<Register />} path="/register" />
              <Route element={<Verification />} path="/authentication/:token" />
              <Route element={<ForgotPassword />} path="/forgot-password" />
              <Route element={<ResetPassword />} path="/reset/:token" />
            </Route>
            <Route element={<WithNav />}>
              <Route element={<Home />} path="/" />
              <Route element={<Profile />} path="/profile/:userId" />
              <Route element={<PostDetail />} path="/post/:postId" />
              <Route element={<ErrorPage />} path="*" />
            </Route>
          </Routes>
        </Router>
      </div>
    );
  }

  return (
    <div className="w-100 text-center align-center my-3">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default App;
