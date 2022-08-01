import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../assets/styles/Home.css";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { API_URL } from "../constants/API";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import PostCard from "../components/PostCard";
import PostGrid from "../components/PostGrid";
import InfiniteScroll from "react-infinite-scroll-component";

function Home() {
  const userGlobal = useSelector((state) => state.user);
  const mainPostImg = require("../assets/images/main/main-post.png");

  // PROFILE IMG DISPLAY URL
  let profileimgUrl = `${API_URL}/profile-img/${userGlobal.profileImg}`;

  const [image, setImage] = useState(mainPostImg); // DISPLAY INPUT IMAGE
  const [saveImage, setSaveImage] = useState(null); // SELECTED IMAGE
  const [addPostData, setAddPostData] = useState({ caption: "" }); // CAPTION
  const [allPosts, setAllPosts] = useState([]); // ALL POSTS FROM DB
  const [likedPosts, setLikedPosts] = useState([]); // USER'S LIKED POSTS
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // console.log("page: ", page);
  // console.log(allPosts);

  // GET ALL POSTS FROM DB
  const getPosts = async (type) => {
    try {
      setIsLoading(true);
      if (type) {
        const response = await Axios.get(
          `${API_URL}/post/getPosts/${page * 5}/5`
        );
        // console.log(response.data);
        setAllPosts([...allPosts, ...response.data]);
        setPage(page + 1);
        if (response.data.length < 5) {
          setHasMore(false);
        }
        setIsLoading(false);
      } else {
        const response = await Axios.get(
          `${API_URL}/post/getPosts/0/${page * 5}`
        );
        // console.log(response.data);
        setAllPosts([...response.data]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //GET USER'S LIKED POSTS
  const getLiked = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/like/getLiked/${userGlobal.id}`
      );
      setLikedPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // RENDER ALL POSTS
  const renderPost = () => {
    return (
      <InfiniteScroll
        dataLength={allPosts.length}
        next={() => getPosts(1)}
        hasMore={hasMore}
      >
        {allPosts.map((item) => {
          return (
            <PostCard
              key={item.postId}
              postItem={item}
              getLiked={() => getLiked()}
              getPosts={() => getPosts(0)}
            />
          );
        })}
        {isLoading && (
          <div className="w-100 text-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </InfiniteScroll>
    );
  };

  // ADD NEW POST
  const addPost = async () => {
    setIsLoading(true);
    try {
      const date = moment().format("MMMM Do YYYY, h:mm a");

      let formData = new FormData();
      formData.append("file", saveImage);
      formData.append("caption", addPostData.caption);
      formData.append("userId", userGlobal.id);
      formData.append("firstName", userGlobal.firstName);
      formData.append("lastName", userGlobal.lastName);
      formData.append("username", userGlobal.username);
      formData.append("timePost", date);

      await Axios.post(`${API_URL}/upload/uploadPost`, formData);
      setImage(mainPostImg);
      setSaveImage(null);
      getPosts(0);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // FILES INPUT HANDLER
  const imgHandler = (e) => {
    let uploaded = e.target.files[0];
    setImage(URL.createObjectURL(uploaded));
    setSaveImage(uploaded);
  };

  // CAPTION INPUT HANDLER
  const captionHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setAddPostData({ ...addPostData, [name]: value });
  };

  useEffect(() => {
    getPosts(1);
    getLiked();
  }, []);

  if (!userGlobal.id) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-container">
      <div className="next-container">
        <div>
          <div className="profile-one position-fixed">
            <div className="profile-one-head position-absolute d-flex flex-column align-items-center">
              <img
                className="profile-profile rounded-circle"
                src={
                  userGlobal.profileImg
                    ? profileimgUrl
                    : require("../assets/images/main/main-profile.png")
                }
                alt="profile"
              />
            </div>

            <div className="profile-one-profile border border-grey d-flex flex-column align-items-center text-center px-2">
              <a href={`/profile/${userGlobal.id}`}>
                <h4>
                  {userGlobal.firstName} {userGlobal.lastName}
                </h4>
              </a>
              <span>Username:</span>
              <h6>{userGlobal.username}</h6>
              <span className="mt-2">Bio:</span>
              <p className="mx-3">{userGlobal.bio}</p>
            </div>

            {likedPosts.length ? (
              <div className="bg-white p-1 border">
                <div className="ps-1 mb-1">
                  <span>Liked Posts</span>
                </div>
                {likedPosts
                  .sort((a, b) => b.likeId - a.likeId)
                  .map((item) => {
                    return <PostGrid key={item.likeId} data={item} />;
                  })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="two col-12">
          <div className="two2 ">
            {userGlobal.isVerified ? (
              <div className="home-post-container border rounded me-2">
                <div className="px-3 pt-1 bg-white border-bottom rounded-top">
                  <h6>Add New Post</h6>
                </div>
                <div className="home-add-post p-1 bg-white rounded-bottom">
                  <div className="form-add-post col-12">
                    <div className="col-1">
                      <img
                        className="prof"
                        src={
                          userGlobal.profileImg
                            ? profileimgUrl
                            : require("../assets/images/main/main-profile.png")
                        }
                        alt="profile"
                      />
                    </div>
                    <div className="col-9 ps-2">
                      <textarea
                        disabled={!saveImage && true}
                        onChange={captionHandler}
                        value={addPostData.caption}
                        name="caption"
                        className="form-control"
                        placeholder="Share new capture"
                      ></textarea>
                    </div>
                    <div className="input-file col-2">
                      <input
                        onChange={imgHandler}
                        type="file"
                        id="file"
                        className="form-control"
                        accept="image/*"
                      />
                      <label htmlFor="file">
                        <img className="border" src={image} alt="add-post" />
                      </label>
                    </div>
                  </div>
                  <button
                    style={{ display: !saveImage && "none" }}
                    disabled={isLoading}
                    onClick={addPost}
                    className="btn btn-primary btn-post btn-sm"
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          variant="info"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {` Posting...`}
                      </>
                    ) : (
                      <>Post</>
                    )}
                  </button>
                </div>
              </div>
            ) : null}
            {renderPost()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
