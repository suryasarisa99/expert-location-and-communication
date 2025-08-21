import useData from "@hooks/useData";
import getFileImg from "@utils/getFileIcon";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import axiosInstance from "@utils/axios";
import { PostType } from "@src/types/PostType";
export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { users } = useData();
  const navigate = useNavigate();
  useEffect(() => {
    axiosInstance
      .get("posts", {
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
          const hasText = !!post.caption;
          const hasUrl = !!post.url;
          let isImg = false;
          console.log("post url: ", post);
          if (hasUrl) isImg = post.type.startsWith("image");

          return (
            <div key={post._id} className={`post ${isImg ? "img" : "file"}`}>
              <div className="post-top-bar">
                <div className="icon-avatar">
                  <FaUserTie />
                </div>
                <p
                  onClick={() => {
                    users.forEach((tutor) => {
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
              {hasUrl &&
                (isImg ? (
                  <img src={post.url} alt="" />
                ) : (
                  <div
                    className="file-preview"
                    onClick={() => {
                      window.open(post.url, "_blank");
                    }}
                  >
                    <div className="left">
                      <div className="file-icon">
                        <img src={getFileImg(post.type, post.ext)} alt="" />
                      </div>
                      <div className="file-details">
                        <p className="file-name">{post.filename}</p>
                        <p className="file-size">{post.size / 1000} kb</p>
                      </div>
                    </div>
                    <a
                      className="download-icon"
                      href={post.url}
                      download={post.filename}
                    >
                      <MdDownload />
                    </a>
                  </div>
                ))}
              <p className="caption">{post.caption}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
