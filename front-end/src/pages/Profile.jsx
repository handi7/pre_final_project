import "../assets/styles/Profile.css";
import { Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../constants/API";
import { Tabs, Tab, Spinner } from "react-bootstrap";
import Axios from "axios";
import moment from "moment";
import Info from "../components/Info";
import PostCard from "../components/PostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import PostGrid from "../components/PostGrid";

function Profile() {
  const userGlobal = useSelector((state) => state.user);
  const { userId } = useParams(); // userId > setting dr App.jsx
  const mainPostImg = require("../assets/images/main/main-post.png");

  const [image, setImage] = useState(mainPostImg); // DISPLAY INPUT IMAGE
  const [saveImage, setSaveImage] = useState(null); // SELECTED IMAGE
  const [data, setData] = useState({ caption: "" }); // CAPTION
  const [posts, setPost] = useState([]); // USER'S POSTS
  const [profile, setProfile] = useState({}); // USER'S PROFILE DATA
  const [likedPosts, setLikedPosts] = useState([]); // USER'S LIKED POSTS
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // PROFILE IMG DISPLAY URL
  let profileimgUrl = `${API_URL}/profile-img/${profile.profileImg}`;

  // GET USER'S POSTS
  const getPosts = async (type) => {
    setIsLoading(true);
    try {
      if (type) {
        const response = await Axios.get(
          `${API_URL}/post/getUserPosts/${userId}/${page * 5}/5`
        );
        setPost([...posts, ...response.data]);
        setPage(page + 1);
        if (response.data.length < 5) {
          setHasMore(false);
        }
        setIsLoading(false);
      } else {
        const response = await Axios.get(
          `${API_URL}/post/getUserPosts/${userId}/0/${page * 5}`
        );
        setPost([...response.data]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // GET PROFILE DATA FROM DB
  const getProfileData = async () => {
    try {
      const response = await Axios.get(`${API_URL}/user/get/${userId}`);
      delete response.data[0].password;
      delete response.data[0].token;
      setProfile(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  //GET USER'S LIKED POSTS
  const getLiked = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/like/getLiked/${profile.id}`
      );
      setLikedPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ADD NEW POSTS
  const addPost = async () => {
    setIsLoading(true);
    try {
      const date = moment().format("MMMM Do YYYY, h:mm a");

      let formData = new FormData();
      formData.append("file", saveImage);
      formData.append("caption", data.caption);
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

  // RENDER USER'S POSTS
  const renderPost = () => {
    return (
      <InfiniteScroll
        dataLength={posts.length}
        next={() => getPosts(1)}
        hasMore={hasMore}
      >
        {posts
          // .sort((a, b) => b.postId - a.postId)
          .map((item) => {
            return (
              <PostCard
                key={item.postId}
                postItem={item}
                getPosts={() => getPosts(0)}
                getLiked={() => getLiked()}
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

  // RENDER USER'S LIKED POSTS
  const renderLikedPost = () => {
    return likedPosts
      .sort((a, b) => b.likeId - a.likeId)
      .map((item) => {
        return (
          <PostCard
            key={item.likeId}
            postItem={item}
            getPosts={() => getPosts()}
            getLiked={() => getLiked()}
          />
        );
      });
  };

  // FILES INPUT HANDLER
  const imgHandler = (e) => {
    let uploaded = e.target.files[0];
    setImage(URL.createObjectURL(uploaded));
    setSaveImage(uploaded);
  };

  // CAPTION INPUT HANDLER
  const captionHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    getPosts(1);
    getProfileData();
  }, []);

  useEffect(() => {
    getLiked();
  }, [profile]);

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
                className="profile-profile"
                src={
                  profile.profileImg
                    ? profileimgUrl
                    : require("../assets/images/main/main-profile.png")
                }
                alt="profile"
              />
            </div>

            <div className="profile-one-profile border border-grey d-flex flex-column">
              <div className="text-center">
                <h4>
                  {userGlobal.id === profile.id
                    ? `${userGlobal.firstName} ${userGlobal.lastName}`
                    : `${profile.firstName} ${profile.lastName}`}
                </h4>
              </div>

              <div className="text-center px-3">
                {userGlobal.id === profile.id ? (
                  <p>{userGlobal.bio}</p>
                ) : (
                  <p>{profile.bio}</p>
                )}
              </div>
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
            <Tabs
              variant="pills"
              defaultActiveKey="home"
              id="uncontrolled-tab-example"
              className="tab bg-white border rounded p-1 mb-2 me-2"
            >
              {/* {userGlobal.isVerified ? (
                <> */}
              <Tab eventKey="home" title="Posts">
                {userGlobal.id === profile.id &&
                  (userGlobal.isVerified ? (
                    <div className="home-post-container border border-grey rounded me-2">
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
                              // value={addPostData.caption}
                              name="caption"
                              className="form-control"
                              placeholder="Share new capture"
                            ></textarea>
                          </div>

                          <div className="input-file col-2">
                            <button
                              style={{ display: !saveImage && "none" }}
                              onClick={() => {
                                setSaveImage(null);
                                setImage(mainPostImg);
                              }}
                              className="btn-ic position-absolute"
                            >
                              <i className="fa fa-close text-danger"></i>
                            </button>

                            <input
                              onChange={imgHandler}
                              type="file"
                              id="file"
                              className="form-control"
                              accept="image/*"
                            />

                            <label htmlFor="file">
                              <img
                                className="border"
                                src={image}
                                alt="add-post"
                              />
                            </label>
                          </div>
                        </div>

                        <button
                          style={{ display: !saveImage && "none" }}
                          disabled={isLoading}
                          onClick={addPost}
                          className="btn btn-post btn-sm"
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
                  ) : null)}

                {renderPost()}
              </Tab>

              <Tab eventKey="liked" title="Liked">
                {renderLikedPost()}
              </Tab>
              {/* </>
              ) : null} */}

              {userGlobal.id === profile.id && (
                <Tab
                  eventKey="info"
                  title={
                    <span>
                      {!userGlobal.isVerified && (
                        <i className="fa fa-exclamation text-warning me-1" />
                      )}
                      Profile
                    </span>
                  }
                >
                  <Info getProfile={() => getProfileData()} profile={profile} />
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
