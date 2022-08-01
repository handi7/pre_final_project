import "font-awesome/css/font-awesome.min.css";
import "../assets/styles/PostDetail.css";
import { API_URL } from "../constants/API";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import moment from "moment";
import Comments from "../components/Comments";

function PostDetail() {
  const ref = useRef(null);
  const { postId } = useParams();
  const userGlobal = useSelector((state) => state.user);

  const [postDetails, setPostDetails] = useState({}); // POST DETAIL
  const [postLikes, setPostLikes] = useState(0); // POST'S LIKES
  const [isLiked, setIsLiked] = useState(0); // USER LIKE THIS POST OR NOT
  const [comments, setComments] = useState([]); // THIS POST'S COMMENTS
  const [commentsLength, setCommentsLength] = useState(0);
  const [editId, setEditId] = useState({}); // EDIT ID FOR EDIT POST'S CAPTION
  // INPUT DATA WHEN ADD OR EDIT COMMENT AND EDIT POST'S CAPTION
  const [inputData, setInputData] = useState({
    addComment: "",
    editCaption: "",
    editComment: "",
  });

  // COMMENTS PAGINATION
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // DISPLAY POST AND COMMENT'S CREATED DATE WITH MOMENT
  const date = (time) => {
    let date = moment(time, "MMMM Do YYYY, h:mm a").calendar();
    if (date.includes("Today")) {
      return (date = moment(time, "MMMM Do YYYY, h:mm a").fromNow());
    }

    return date;
  };

  // GET POST'S DETAILS
  const getPostDetails = async () => {
    try {
      const response = await Axios.get(`${API_URL}/post/details/${postId}`);
      setPostDetails({ ...postDetails, ...response.data[0] });
    } catch (error) {
      console.log(error);
    }
  };

  // GET POST'S LIKES
  const getPostLikes = async () => {
    try {
      const response = await Axios.get(`${API_URL}/like/postLikes/${postId}`);
      setPostLikes(response.data[0].postLikes);
    } catch (error) {
      console.log(error);
    }
  };

  // GET INFO THAT THE USER LIKE THIS POST OR NOT
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

  // GET POST'S COMMENTS
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

  // RENDER POST'S COMMENTS
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

  // WHEN LIKE BUTTON CLICKED
  const like = async () => {
    try {
      await Axios.post(`${API_URL}/like/addLike`, {
        postId,
        userId: userGlobal.id,
      });
      getPostLikes();
      getIsLiked();
    } catch (error) {
      console.log(error);
    }
  };

  // WHEN UNLIKE BUTTON CLICKED
  const unLike = async () => {
    try {
      await Axios.delete(`${API_URL}/like/delete/${postId}/${userGlobal.id}`);
      getPostLikes();
      getIsLiked();
    } catch (error) {
      console.log(error);
    }
  };

  // ADD COMMENT BUTTON HANDLER
  const addComment = async () => {
    // e.preventDefault();
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
      setInputData({ ...inputData, addComment: "" });
    } catch (error) {
      console.log(error);
    }
  };

  // CAPTION OR COMMENT'S EDIT BUTTON HANDLER
  const btnEdit = (editId, field, val) => {
    setEditId({ [field]: editId });
    setInputData({ [field]: val });
  };

  // CANCEL BUTTON HANDLER
  const cancelEdit = (field) => {
    setEditId({ [field]: 0 });
  };

  // INPUT HANDLER (ADD OR EDIT COMMENT AND EDIT POST'S CAPTION)
  const inputHandler = (event) => {
    const { name, value } = event.target;

    setInputData({ [name]: value });
  };

  // SAVE BUTTON HANDLER
  const saveCaption = async () => {
    try {
      await Axios.post(`${API_URL}/post/editCaption`, {
        postId,
        caption: inputData.editCaption,
      });
      setEditId({ editCaption: 0 });
      getPostDetails();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostDetails();
    getPostLikes();
    getIsLiked();
    getComments(1);
    getCommentsLength();
  }, []);

  if (!userGlobal.id) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="post-detail-container">
      <div className="detail-container border rounded">
        <div className="d-flex flex-column align-items-center">
          <div className="img-detail">
            <img
              src={
                postDetails.imagePost
                  ? `${API_URL}/posts/${postDetails.imagePost}`
                  : require("../assets/images/main/main-post.png")
              }
              alt="post"
            />
          </div>
          <div className="detile-container">
            <div className="detile-container2 d-flex flex-row justify-content-between">
              <div className="d-flex flex-row align-items-center">
                <img
                  className="card-prof-img rounded-circle"
                  src={
                    postDetails.profileImg
                      ? `${API_URL}/profile-img/${postDetails.profileImg}`
                      : require("../assets/images/main/main-profile.png")
                  }
                  alt="profile"
                />
                <div className="d-flex flex-column">
                  <span>
                    <a
                      href={`/profile/${postDetails.userId}`}
                    >{`${postDetails.firstName} ${postDetails.lastName}`}</a>
                  </span>
                  <span className="stamp">{date(postDetails.timePost)}</span>
                </div>
              </div>

              {userGlobal.id === postDetails.userId ? (
                <div className="btn-group">
                  <button
                    onClick={() =>
                      btnEdit(postId, "editCaption", postDetails.caption)
                    }
                    className="btn-ic mx-1"
                  >
                    <i className="fa fa-edit" />
                  </button>
                  {/* <button
                  onClick={deletePost}
                  className="btn-ic me-2 text-danger"
                >
                  <i className="fa fa-trash" />
                </button> */}
                </div>
              ) : null}
            </div>

            <div className="text-wrap mx-3">
              <p>{postDetails.caption}</p>
            </div>
            {postDetails.caption ? (
              <div className="m-1 p-1 text-end">
                {editId.editCaption ? (
                  <div className="d-flex flex-row align-items-end">
                    <textarea
                      onChange={inputHandler}
                      name="editCaption"
                      value={inputData.editCaption}
                      className="form-control"
                    ></textarea>
                    <div>
                      <button
                        onClick={saveCaption}
                        className="w-100 btn btn-sm btn-success ms-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEdit("editCaption")}
                        className="w-100 btn btn-sm btn-warning ms-1 mt-1"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div>
              <div className="info d-flex flex-row border-bottom">
                <div className="px-2 py-2">
                  <span>
                    <i className="btn-ic fa fa-heart" />
                    {` ${postLikes}`}
                  </span>
                </div>
                <div className="px-2 py-2">
                  <span>
                    <i className="btn-ic fa fa-comment" />
                    {` ${commentsLength}`}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-row justify-content-around p-1">
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
                  <button
                    disabled={!userGlobal.isVerified}
                    onClick={() => ref.current.focus()}
                    className="btn-tr"
                  >
                    <i className="btn-ic fa fa-comment-o" /> Comment
                  </button>
                </div>
              </div>

              {/* <div className="w-100 d-flex flex-column px-2"> */}
              <div className="w-100 p-2">
                {hasMore && (
                  <div className="text-center mb-2">
                    <button className="btn-ic" onClick={getComments}>
                      see more
                    </button>
                  </div>
                )}
                {renderComments()}
              </div>
              {userGlobal.isVerified ? (
                // <form className="commentForm" onSubmit={addComment}>
                <div className="comment d-flex flex-row align-items-end p-2">
                  <textarea
                    ref={ref}
                    onChange={inputHandler}
                    name="addComment"
                    value={inputData.addComment}
                    className="form-control"
                    type="text"
                    placeholder="Comment"
                    maxLength={300}
                  />
                  <div>
                    <button
                      onClick={addComment}
                      className="btn btn-primary btn-sm ms-2"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : // {/* </form> */}
              null}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
