import "../assets/styles/Comments.css";
import Axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../constants/API";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";

export default function Comments(props) {
  const userGlobal = useSelector((state) => state.user);
  const { id, postId, userId, comment, date, username, profileImg } =
    props.data;
  let time = moment(date, "MMMM Do YYYY, h:mm a").calendar();
  if (time.includes("Today")) {
    time = moment(date, "MMMM Do YYYY, h:mm a").fromNow();
  }
  // PROFILE IMG DISPLAY URL
  let profimgUrl = `${API_URL}/profile-img/${profileImg}`;

  const [inputData, setInputData] = useState({
    addComment: "",
    editCaption: "",
    editComment: "",
  });
  const [editId, setEditId] = useState({});

  const btnEdit = (editId, field, val) => {
    setEditId({ [field]: editId });
    setInputData({ [field]: val });
  };

  const saveComment = async (id, comment) => {
    try {
      await Axios.post(`${API_URL}/comment/edit`, { id, comment });
      setEditId({ editComment: 0 });
      props.getComments();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = (field) => {
    setEditId({ [field]: 0 });
  };

  const deleteComment = async (id, comment) => {
    try {
      const alert = await Swal.fire({
        title: "Are you sure to delete this comment?",
        text: `'${comment}'`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      });

      if (alert.isConfirmed) {
        await Axios.post(`${API_URL}/comment/delete/${id}`);
        props.getComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;

    setInputData({ [name]: value });
  };

  return (
    // <div className=" bg-primary d-flex flex-column align-items-center">
    <div className="col-12 d-flex flex-row">
      {/* <div className="d-flex flex-column justify-content-between"> */}
      <div>
        <img
          className="comment-prof rounded-circle mt-2 me-2"
          src={
            profileImg
              ? profimgUrl
              : require("../assets/images/main/main-profile.png")
          }
          alt="profile"
        />
      </div>
      {/* </div> */}
      <div className="com">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-column">
            <a href={`/profile/${userId}`}>{`${username}`}</a>
            <span className="stamp">{time}</span>
          </div>
          {userId === userGlobal.id ? (
            editId.editComment === id ? null : (
              <div className="d-flex flex-row">
                {/* <button
                    onClick={() => btnEdit(id, "editComment", comment)}
                    className="btn-edit "
                  >
                    <i className="fa fa-edit" />
                  </button>
                  <button
                    onClick={() => deleteComment(id, comment)}
                    className="btn-ic text-danger "
                  >
                    <i className="fa fa-trash" />
                  </button> */}
                <Dropdown>
                  <Dropdown.Toggle
                    style={{
                      backgroundColor: "transparent",
                      color: "blue",
                      border: "none",
                      boxShadow: "none",
                    }}
                  ></Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <button
                        onClick={() => btnEdit(id, "editComment", comment)}
                        className="btn-ic w-100"
                      >
                        Edit
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <button
                        onClick={() => deleteComment(id, comment)}
                        className="btn-ic text-danger w-100"
                      >
                        Delete
                      </button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )
          ) : null}
        </div>
        <div>
          <p className="text-wrap">{comment}</p>
          {userId === userGlobal.id && editId.editComment === id && (
            <span className="d-flex flex-row align-items-center">
              <textarea
                onChange={inputHandler}
                className="form-control"
                name="editComment"
                value={inputData.editComment}
                placeholder="Edit Comment"
                type="text"
                maxLength="300"
              />
              <div className="d-flex flex-column ms-2">
                <button
                  onClick={() => cancelEdit("editComment")}
                  className="btn btn-warning btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveComment(id, inputData.editComment)}
                  className="btn btn-success btn-sm mt-1"
                >
                  Save
                </button>
              </div>
            </span>
          )}
        </div>
      </div>

      {/* <div className="border-top"></div> */}
    </div>
    // </div>
  );
}
