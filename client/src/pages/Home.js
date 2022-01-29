import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../helpers/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userState, toggleUserState } = useContext(UserContext);
  const [message, setMessage] = useState(null);
  const [articleList, setArticleList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      navigate("/signin")
    } else if (user && userState === false) {
      toggleUserState();
    };

    if (user) {

      axios.get("http://localhost:8080/api/article", { headers : { 'x-access-token': user.accessToken } })
        .then((res) => {
          setArticleList(res.data);
          console.log(articleList);
        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="articleWrapper">
      {message && (
        <span>{message}</span>
      )}
      {articleList.map((value, key) => {
        return (
          <div className="articleCard" key={key}>
            <div className="articleBody"  onClick={() => {
              navigate(`/article/${value.id}`)
            }}>
              <h3>{value.title}</h3>
              <p>
                {value.content}
              </p>
            </div>
            <div className="articleFooter">
              <span>Likes : {value.like.value}</span>
              {value.userId ? (
          <span onClick={() => {
            navigate(`/user/${value.userId}`)
          }}>
            Author : {value.author}
          </span>
        ) : (
          <span>
            Author (deleted): {value.author}
          </span>
        )}
              <span>Comments : {value.commentCount}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default Home;