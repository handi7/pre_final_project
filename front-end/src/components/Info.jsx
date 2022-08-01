import "../assets/styles/Info.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { useDispatch } from "react-redux";
import { Modal, ModalBody, Spinner } from "react-bootstrap";

export default function Info(props) {
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editId, setEditId] = useState({});
  const [editData, setEditData] = useState({});
  const [send, setSend] = useState({});
  const [msg, setMsg] = useState({});
  const [notValid, setNotValid] = useState({});
  const [btnDisable, setBtnDisable] = useState({ username: true });
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState({
    prevImg: require("../assets/images/main/main-post.png"),
  });

  const usernamePattern = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/;
  const emailPattern =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;

  const usernameIsValid = usernamePattern.test(editData.username);
  const emailIsValid = emailPattern.test(editData.email);

  const resendEmail = async () => {
    setSend({ sending: true });
    try {
      const { id, username, email, isVerified } = userGlobal;
      const response = await Axios.post(`${API_URL}/user/resend`, {
        id,
        username,
        email,
        isVerified,
      });
      setSend({ sending: false, msg: response.data });
    } catch (error) {
      setSend({ sending: false, msg: "Server error." });
      console.log(error);
    }
  };

  const btnEdit = (field) => {
    setEditId({ [field]: userGlobal.id });
    setEditData({ [field]: userGlobal[field] });
  };

  const check = async () => {
    setMsg({});
    setBtnDisable({ username: true, email: true });
    setLoading(true);

    try {
      const result = await Axios.post(`${API_URL}/user/check`, editData);

      if (result.data.includes("username")) {
        if (result.data.includes("error")) {
          setMsg({ ...msg, usernameErr: "Username already exist." });
          setBtnDisable({ username: true, email: true });
          setLoading(false);
        } else {
          setBtnDisable({ username: false, email: true });
          setLoading(false);
        }
      } else {
        if (result.data.includes("error")) {
          setMsg({ ...msg, emailErr: "Email already registered." });
          setBtnDisable({ username: true, email: true });
          setLoading(false);
        } else {
          setBtnDisable({ username: true, email: false });
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const cancelEdit = (field) => {
    setEditId({ ...editId, [field]: 0 });
    setBtnDisable({ username: true, email: true });
    setMsg({});
  };

  const saveEdit = async (id) => {
    try {
      const result = await Axios.patch(`${API_URL}/user/edit/${id}`, editData);
      delete result.data[0].password;

      if (result) {
        setEditId({});
        setBtnDisable({ username: true, email: true });
        setMsg({});
        dispatch({
          type: "USER_LOGIN",
          payload: result.data[0],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const btnUpload = async () => {
    try {
      if (img.addFile) {
        let formData = new FormData();
        formData.append("file", img.addFile);
        formData.append("userId", userGlobal.id);
        formData.append("oldImg", userGlobal.profileImg);

        await Axios.post(`${API_URL}/upload/uploadProfile`, formData);
        setModalShow(false);
        props.getProfile();
        // window.location.reload();
      } else {
        alert("no file chosen");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputFileHandler = (event) => {
    const file = event.target.files[0];
    setImg({ addFile: file, prevImg: URL.createObjectURL(file) });
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;

    setMsg({});
    setBtnDisable({ username: true, email: true });
    setEditData({ [name]: value });
  };

  useEffect(() => {
    if (!usernameIsValid && editId.username) {
      setNotValid({
        username: "6-15 char included letter & number with no special char.",
      });
    } else {
      setNotValid({ username: "" });
    }
  }, [usernameIsValid, editId.username]);

  useEffect(() => {
    if (!emailIsValid && editId.email) {
      setNotValid({ email: "Email isn't valid." });
    } else {
      setNotValid({ email: "" });
    }
  }, [emailIsValid, editId.email]);

  return (
    <div className="main-info bg-white border rounded p-3 me-2">
      <div className="d-flex flex-row">
        <div className="profile-image d-flex flex-column align-items-center me-2">
          <img
            src={
              props.profile.profileImg
                ? `${API_URL}/profile-img/${props.profile.profileImg}`
                : require("../assets/images/main/main-profile.png")
            }
            alt="profileImg"
          />
          <button
            disabled={!userGlobal.isVerified}
            onClick={() => setModalShow(true)}
            className="btn-tr"
          >
            Change
          </button>
        </div>

        <div className="bio d-flex justify-content-between">
          <div>
            <span>Bio:</span>
            {editId.bio ? (
              <textarea
                className="form-control"
                name="bio"
                onChange={inputHandler}
                value={editData.bio ? editData.bio : ""}
                placeholder="Bio"
              ></textarea>
            ) : (
              <p>{userGlobal.bio ? userGlobal.bio : null}</p>
            )}
          </div>

          <div>
            {editId.bio ? (
              <div className="d-flex flex-column">
                <button
                  onClick={() => cancelEdit("bio")}
                  className="btn btn-sm btn-warning m-1"
                >
                  cancel
                </button>
                <button
                  onClick={() => saveEdit(editId.bio)}
                  className="btn btn-sm btn-success m-1"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                disabled={!userGlobal.isVerified}
                onClick={() => btnEdit("bio")}
                className="btn-edit"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <span>First Name</span>
        <div className="d-flex flex-row justify-content-between align-items-center border-bottom pb-1">
          <div>
            {editId.firstName ? (
              <input
                className="form-control"
                onChange={inputHandler}
                name="firstName"
                value={editData.firstName}
                placeholder="First Name"
                type="text"
              />
            ) : (
              <h5>{userGlobal.firstName}</h5>
            )}
          </div>

          {editId.firstName ? (
            <div>
              <button
                onClick={() => saveEdit(editId.firstName)}
                className="btn btn-sm btn-success m-1"
              >
                Save
              </button>
              <button
                onClick={() => cancelEdit("firstName")}
                className="btn btn-sm btn-warning m-1"
              >
                cancel
              </button>
            </div>
          ) : (
            <button
              disabled={!userGlobal.isVerified}
              onClick={() => btnEdit("firstName")}
              className="btn-edit"
            >
              Edit
            </button>
          )}
        </div>

        <div className="mt-3">
          <span>Last Name</span>
          <div className="d-flex flex-row justify-content-between align-items-center border-bottom pb-1">
            <div>
              {editId.lastName ? (
                <input
                  className="form-control"
                  onChange={inputHandler}
                  name="lastName"
                  value={editData.lastName}
                  placeholder="Last Name"
                  type="text"
                />
              ) : (
                <h5>{userGlobal.lastName}</h5>
              )}
            </div>

            {editId.lastName ? (
              <div>
                <button
                  onClick={() => saveEdit(editId.lastName)}
                  className="btn btn-sm btn-success m-1"
                >
                  Save
                </button>
                <button
                  onClick={() => cancelEdit("lastName")}
                  className="btn btn-sm btn-warning m-1"
                >
                  cancel
                </button>
              </div>
            ) : (
              <button
                disabled={!userGlobal.isVerified}
                onClick={() => btnEdit("lastName")}
                className="btn-edit"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 border-bottom">
          <span>Username</span>
          <div className="d-flex flex-row justify-content-between align-items-center pb-1">
            <div>
              {editId.username ? (
                <div className="d-flex flex-row align-items-center">
                  <input
                    className="form-control"
                    onChange={inputHandler}
                    name="username"
                    value={editData.username}
                    placeholder="Username"
                    type="text"
                  />
                  <div>
                    <button
                      disabled={!usernameIsValid || loading}
                      onClick={check}
                      className="btn btn-sm btn-success mx-1"
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
                          {` Checking...`}
                        </>
                      ) : (
                        <>Check</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <h5>{userGlobal.username}</h5>
              )}
            </div>

            {editId.username ? (
              <div className="d-flex flex-row">
                <button
                  disabled={btnDisable.username}
                  onClick={() => saveEdit(editId.username)}
                  className="btn btn-sm btn-success m-1"
                >
                  Save
                </button>
                <button
                  onClick={() => cancelEdit("username")}
                  className="btn btn-sm btn-warning m-1"
                >
                  cancel
                </button>
              </div>
            ) : (
              <button
                disabled={!userGlobal.isVerified}
                onClick={() => btnEdit("username")}
                className="btn-edit"
              >
                Edit
              </button>
            )}
          </div>
          {notValid.username ? (
            <span className="text-danger">{notValid.username}</span>
          ) : msg.usernameErr ? (
            !btnDisable.username ? null : (
              <span className="text-danger">{msg.usernameErr}</span>
            )
          ) : btnDisable.username ? null : (
            <i className="fa fa-check text-success">Username available.</i>
          )}
        </div>

        <div className="mt-3">
          <span>Email </span>(
          {userGlobal.isVerified ? (
            <span className="text-success">Verified</span>
          ) : (
            <span className="text-danger">Unverified</span>
          )}
          )
          <div className="d-flex flex-row justify-content-between align-items-center pb-1">
            <div>
              <h5>{userGlobal.email}</h5>
            </div>

            <span>Email can't be changed.</span>
          </div>
          <div className="border-bottom">
            {userGlobal.isVerified ? null : (
              <>
                <button
                  disabled={send.sending}
                  onClick={resendEmail}
                  className="btn-edit"
                >
                  {send.sending ? "Sending..." : "Resend verification mail"}
                </button>
                {send.msg ? (
                  <span className="text-success">{send.msg}</span>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setImg({ prevImg: require("../assets/images/main/main-post.png") });
        }}
        size="lg"
        // centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Upload Profile Image
          </Modal.Title>
        </Modal.Header>
        <ModalBody>
          <div>
            <div className="d-flex flex-column align-items-center">
              <img src={img.prevImg} width="70%" className="border p-1" />
            </div>
            <div>
              <input
                onChange={inputFileHandler}
                type="file"
                className="form-control mt-2"
              />
              <button onClick={btnUpload} className="btn btn-primary mt-2">
                Upload
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
