import useData from "@hooks/useData";
import getFileImg from "@utils/getFileIcon";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  type PostType = {
    username: string;
    name: string;
    size: number;
    caption: string;
    filename: string;
    time: string;
    ext: string;
    type: string;
    url: string;
    _id: string;
    // isImg: boolean;
  };
  const [posts, setPosts] = useState<PostType[]>([]);
  const { tutors } = useData();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/posts`, {
        withCredentials: true,
      })
      .then((res) => {
        setPosts(res.data.posts);
        console.log(res.data);
      });
  }, []);

  return (
    <div className="posts-page page">
      {/* <h1>Posts</h1> */}
      {/* <p>Posts page content</p> */}

      <div className="posts">
        {posts.map((post) => {
          const isImg = post.type.startsWith("image");
          return (
            <div key={post._id} className={`post ${isImg ? "img" : "file"}`}>
              <div className="post-top-bar">
                <div className="icon-avatar">
                  <FaUser />
                </div>
                <p
                  onClick={() => {
                    tutors.forEach((tutor) => {
                      if (tutor._id === post.username) {
                        if (tutor.status == "accepted") {
                          navigate(`/chat/${post.username}`);
                        }
                      }
                    });
                  }}
                  className="name"
                >
                  {post.name}
                </p>
              </div>
              {isImg ? (
                <img src={post.url} alt="" />
              ) : (
                <div className="file-preview">
                  <div className="file-icon">
                    <img src={getFileImg(post.type, post.ext)} alt="" />
                  </div>
                  <div className="file-details">
                    <p className="file-name">{post.filename}</p>
                    <p className="file-size">{post.size / 1000} kb</p>
                  </div>
                </div>
              )}
              <p className="caption">{post.caption}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
