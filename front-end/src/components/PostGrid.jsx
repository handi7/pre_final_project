import Axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../constants/API";

export default function PostGrid(props) {
  const { postId } = props.data;

  const [postDetail, setPostDetail] = useState({});

  const getPostDetail = async () => {
    try {
      const response = await Axios.get(`${API_URL}/post/details/${postId}`);
      setPostDetail(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostDetail();
  }, []);

  return (
    <a href={`/post/${postId}`}>
      <img
        src={
          postDetail.imagePost
            ? `${API_URL}/posts/${postDetail.imagePost}`
            : require("../assets/images/main/main-post.png")
        }
        alt="post"
        className="home-liked border"
      />
    </a>
  );
}
