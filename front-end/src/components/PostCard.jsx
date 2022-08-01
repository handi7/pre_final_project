import "../assets/styles/PostCard.css";
import { useSelector } from "react-redux";
import { API_URL } from "../constants/API";
import React, { useState, useEffect, useRef } from "react";
import { FacebookButton, FacebookCount, GooglePlusButton } from "react-social";
import Axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import Comments from "./Comments";
import Dropdown from "react-bootstrap/Dropdown";

function PostCard(props) {
  const userGlobal = useSelector((state) => state.user);
  const ref = useRef(null);

  const { postId, userId } = props.postItem;

  const [postDetail, setPostDetail] = useState({});
  const [isLiked, setIsLiked] = useState(0);
  const [postLikes, setPostLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsLength, setCommentsLength] = useState(0);
  const [editId, setEditId] = useState({});
  const [inputData, setInputData] = useState({
    addComment: "",
    editCaption: "",
    editComment: "",
  });

  // console.log("input comment: ", inputData.addComment.length);

  let date = moment(postDetail.timePost, "MMMM Do YYYY, h:mm a").calendar();
  if (date.includes("Today")) {
    date = moment(postDetail.timePost, "MMMM Do YYYY, h:mm a").fromNow();
  }

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getPostDetail = async () => {
    try {
      const response = await Axios.get(`${API_URL}/post/details/${postId}`);
      setPostDetail(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getPostLikes = async () => {
    try {
      const response = await Axios.get(`${API_URL}/like/postLikes/${postId}`);
      setPostLikes(response.data[0].postLikes);
    } catch (error) {
      console.log(error);
    }
  };

  const getIsLiked = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/like/isLiked/${userGlobal.id}/${postId}`
      );
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async (type) => {
    try {
      if (type) {
        const response = await Axios.post(
          `${API_URL}/comment/get/${postId}/${page * 5}/5`
        );
        setComments([...response.data, ...comments]);
        setPage(page + 1);
        if (response.data.length < 5) {
          setHasMore(false);
        }
      } else {
        const response = await Axios.post(
          `${API_URL}/comment/get/${postId}/0/${page * 5}`
        );
        setComments([...response.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCommentsLength = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/comment/commentsLength/${postId}`
      );
      setCommentsLength(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderComments = () => {
    return comments
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((item) => {
        return (
          <Comments
            key={item.id}
            data={item}
            getComments={() => getComments()}
          />
        );
      });
  };

  const like = async () => {
    try {
      await Axios.post(`${API_URL}/like/addLike`, {
        postId,
        userId: userGlobal.id,
      });
      getPostLikes();
      getIsLiked();
      props.getLiked();
    } catch (error) {
      console.log(error);
    }
  };

  const unLike = async () => {
    try {
      await Axios.delete(`${API_URL}/like/delete/${postId}/${userGlobal.id}`);
      getPostLikes();
      getIsLiked();
      props.getLiked();
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      if (!inputData.addComment) {
        return;
      }
      const date = moment().format("MMMM Do YYYY, h:mm a");
      await Axios.post(`${API_URL}/comment/add`, {
        postId,
        userId: userGlobal.id,
        comment: inputData.addComment,
        date,
      });
      getComments(0);
      getCommentsLength();
      setInputData({ ...inputData, addComment: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const btnEdit = (editId, field, val) => {
    setEditId({ [field]: editId });
    setInputData({ [field]: val });
  };

  const saveCaption = async () => {
    try {
      await Axios.post(`${API_URL}/post/editCaption`, {
        postId,
        caption: inputData.editCaption,
      });
      setEditId({ editCaption: 0 });
      getPostDetail();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = (field) => {
    setEditId({ [field]: 0 });
  };

  const deletePost = async () => {
    try {
      const alert = await Swal.fire({
        title: "Are you sure to delete this post?",
        text: `'${postDetail.caption}'`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      });
      if (alert.isConfirmed) {
        await Axios.post(`${API_URL}/post/deletePost/${postId}`, {
          imgName: postDetail.imagePost,
        });

        props.getPosts(0);
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;

    setInputData({ [name]: value });
  };

  useEffect(() => {
    getPostLikes();
    getIsLiked();
    getComments(1);
    getCommentsLength();
    getPostDetail();
  }, []);

  return (
    <div className="main-card card my-3 me-2">
      <div className="d-flex flex-row justify-content-between">
        <div className="d-flex flex-row align-items-center">
          <img
            className="card-prof-img rounded-circle"
            src={
              postDetail.profileImg
                ? `${API_URL}/profile-img/${postDetail.profileImg}`
                : require("../assets/images/main/main-profile.png")
            }
            alt="profile"
          />
          <div className="d-flex flex-column">
            <span>
              <a href={`/profile/${userId}`}>
                {/* {`${postDetail.firstName} ${postDetail.lastName}`} */}
                {`${postDetail.username}`}
              </a>
            </span>
            <span className="stamp">{date}</span>
          </div>
        </div>

        {userGlobal.id === userId ? (
          <div className="btn-group">
            {/* <button
              onClick={() => btnEdit(postId, "editCaption", caption)}
              className="btn-ic mx-1"
            >
              <i className="fa fa-edit" />
            </button>
            <button onClick={deletePost} className="btn-ic me-2 text-danger">
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
                    onClick={() =>
                      btnEdit(postId, "editCaption", postDetail.caption)
                    }
                    className="btn-ic w-100"
                  >
                    Edit
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    onClick={deletePost}
                    className="btn-ic text-danger w-100"
                  >
                    Delete
                  </button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : null}
      </div>

      <div className="mx-2 mb-1">
        {editId.editCaption ? (
          <div className="d-flex flex-row">
            <textarea
              onChange={inputHandler}
              name="editCaption"
              value={inputData.editCaption}
              className="form-control"
              placeholder="Caption"
            ></textarea>
            <div className="d-flex flex-column ms-2">
              <button
                onClick={() => cancelEdit("editCaption")}
                className="btn btn-warning btn-sm mb-1"
              >
                Cancel
              </button>
              <button
                onClick={saveCaption}
                className="btn btn-success btn-sm px-3"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p>{postDetail.caption}</p>
        )}
      </div>

      <div className="card-post-img">
        <a href={`/post/${postId}`}>
          <img
            src={
              postDetail.imagePost
                ? `${API_URL}/posts/${postDetail.imagePost}`
                : require("../assets/images/main/main-post.png")
            }
            alt="post"
          />
        </a>
      </div>

      <div className="info d-flex flex-row justify-content-between align-items-center border-bottom ps-2">
        <div className="d-flex flex-row">
          <div className="me-3">
            <i className="btn-ic fa fa-heart" />
            {` ${postLikes}`}
          </div>
          <div>
            <i className="btn-ic fa fa-comment" />
            {` ${commentsLength}`}
          </div>
        </div>
        <div>
          <Dropdown>
            <Dropdown.Toggle
              style={{
                backgroundColor: "transparent",
                color: "transparent",
                border: "none",
                boxShadow: "none",
              }}
            >
              <i className="btn-ic fa fa-share" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <button
                  // onClick={() =>
                  //   btnEdit(postId, "editCaption", postDetail.caption)
                  // }
                  className="btn-ic w-100"
                >
                  Whatsapp
                </button>
              </Dropdown.Item>
              <Dropdown.Item>
                <button
                  // onClick={deletePost}
                  className="btn-ic w-100"
                >
                  Twitter
                </button>
              </Dropdown.Item>
              <Dropdown.Item>
                <button
                  // onClick={deletePost}
                  className="btn-ic w-100"
                >
                  Facebook
                </button>
              </Dropdown.Item>
              <Dropdown.Item>
                <button
                  // onClick={deletePost}
                  className="btn-ic w-100"
                >
                  Copy link
                </button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* <button className="btn-ic">
            <i className="fa fa-share" />
          </button> */}
        </div>
      </div>

      <div className="d-flex flex-row justify-content-around p-1">
        {/* <div className="card-like">
          Like
        </div> */}
        <div className="col-sm border">
          {isLiked ? (
            <button onClick={unLike} className="btn-tr">
              <i className="btn-ic fa fa-heart" /> Unlike
            </button>
          ) : (
            <button
              disabled={!userGlobal.isVerified}
              onClick={like}
              className="btn-tr"
            >
              <i className="btn-ic fa fa-heart-o" /> Like
            </button>
          )}
        </div>
        <div className="col-sm border">
          {/* <a href={() => `input[name=addComment]`.focus()}> */}
          <button
            onClick={() => ref.current.focus()}
            disabled={!userGlobal.isVerified}
            className="btn-tr"
          >
            <i className="btn-ic fa fa-comment-o" /> Comment
          </button>
          {/* </a> */}
        </div>
      </div>

      <div>
        <div className="m-1 p-1 ">
          <div className="pe-3">
            {/* <div className="scroll"> */}
            {hasMore && (
              <div className="text-center mb-2">
                <button className="btn-ic" onClick={getComments}>
                  see more
                </button>
              </div>
            )}
            {renderComments()}
            {/* </div> */}
          </div>
          {userGlobal.isVerified ? (
            <div className="comment d-flex flex-row align-items-end">
              <textarea
                ref={ref}
                onChange={inputHandler}
                name="addComment"
                value={inputData.addComment}
                maxLength="300"
                className="form-control m-1"
                type="text"
                placeholder="Comment"
              />
              <div>
                <button
                  onClick={addComment}
                  className="btn btn-primary btn-sm m-1"
                >
                  Send
                  {/* <i className="fa fa-paper-plane" /> */}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
