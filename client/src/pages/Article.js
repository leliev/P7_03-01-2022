import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams, useNavigate} from 'react-router-dom';
import Create from "../components/Article/Create";
import ActionBar from "../components/Article/ActionBar";

function Article() {
  let { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const payload = {id: user.id};

  const [message, setMessage] = useState(null);
  const [displayForm, setDisplayForm] = useState(false);
  const [article, setArticle] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [liked, setLiked] = useState(null);

  const navigate = useNavigate();
  //const URL = "http://localhost:8080/api/article"

  useEffect(() => {
    if (user) {

      const payload = { "element": id, "user": user.id };
      const data = JSON.stringify(payload);

      axios.get(`http://localhost:8080/api/article/${data}`, { headers : { 'x-access-token': user.accessToken } })
        .then((res) => {
          const likeValue = res.data.isLiked;
          setLiked(likeValue);

          const currentArticle = res.data.article;
          setArticle(currentArticle);

          const comments = currentArticle.comments;
          setCommentList(comments);

          console.log(res.data.article)
        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    } else {
      navigate("/signin");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liked])

  function handleClick() {
    axios.put(`http://localhost:8080/api/like/${article.id}`, payload, { headers : { 'x-access-token': user.accessToken } })
      .then((response) => {
        console.log(response.data.message);
        setLiked(!liked)
      }).catch((error) => {
        setMessage(error.response.data.message);
        console.log(error);
      });
  };

  function toggleForm() {
    setDisplayForm(!displayForm);
  };

  return (
    <div>
      {displayForm ? (
        <div>
          <button onClick={toggleForm}>
            Close form
          </button>
          <Create props={user}/>
        </div> 
      ) : (
        <div>
          <button onClick={toggleForm}>
            Share your Story
          </button>
        </div>
      )}
      <div className="articleCard">

        {message && (
              <span>{message}</span>
            )}

        <div className="articleBody">
          <h3>{article.title}</h3>
          <p>
            {article.content}
          </p>
        </div>

        <div className="articleFooter">

          <div>
            <button onClick={handleClick}>{liked ? "Unlike" : "Like"}</button>
          </div>

          <span>Likes : {article.like ? article.like.value : 0}</span>
    
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
      
          <span>Comments : {article.comments ? article.comments.length : 0 }</span>
        </div>

        <div>
          <ActionBar props={article}/>
        </div>
      </div>

      <div className="commentWrapper">
        {commentList.map((value, key) => {
          return (
            <div className="commentCard" key={key} onClick={() => {
              navigate(`/comments/${value.id}`)
            }}>
              <p>
                {value.content}
              </p>
              <span>Author : {value.author}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Article;