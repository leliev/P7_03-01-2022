import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Create from "../components/Article/Create";
import ActionBar from "../components/ActionBar";

function Home() {
  
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [message, setMessage] = useState(null);
  const [articleList, setArticleList] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    setMessage("");

    if (!user) {
      navigate("/signin");
    };

    if (user) {
      axios.get("http://localhost:8080/api/article", { headers : { 'x-access-token': user.accessToken } })

        .then((res) => {
          setArticleList(res.data);

        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });

        //return setArticleList([])
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  function toggleForm() {
    setDisplayForm(!displayForm);
  };

  return (
    <div className="articleWrapper">
      {message && (
        <span>{message}</span>
      )}
      {displayForm ? (
        <div className="articleCreator">
          <button onClick={toggleForm}>
            Close form
          </button>
          <Create props={user}/>
        </div> 
      ) : (
        <div className="articleCreator">
          <button onClick={toggleForm}>
            Share your Story
          </button>
        </div>
      )}
      {articleList.map((article, key) => {
        return (
          <div className="articleCard" key={key}>

            <div className="articleBody"  onClick={() => {
              navigate(`/article/${article.id}`)
            }}>
              <h2>{article.title}</h2>
              <p>
                {article.content}
              </p>
            </div>

            <div className="articleFooter">
              <span>Likes : {article.like.value}</span>

              {article.userId ? (
                <span onClick={() => {
                  navigate(`/user/${article.userId}`)
                }}>
                  Author : {article.author}
                </span>
              ) : (
                <span>
                  Author (deleted): {article.author}
                </span>
              )}

              <span>Comments : {article.commentCount}</span>
            </div>
            <ActionBar props={article} />
          </div>
        )
      })}
    </div>
  )
}
export default Home;