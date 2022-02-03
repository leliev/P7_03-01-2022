import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../helpers/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Create from "../components/Article/Create";
import ActionBar from "../components/ActionBar";

function Home() {
  
  
  const { userState } = useContext(UserContext);
  const user = userState
  const [message, setMessage] = useState(null);
  const [articleList, setArticleList] = useState([]);
  const [refresh, setRefresh] = useState(false)
  
  const navigate = useNavigate();


  useEffect(() => {
    //Reset message on render
    setMessage("");
    //If not logged In return to signin
    if (!user.isLogged) {
      navigate("/signin");
      //Else get article list
    } else if (user.isLogged) { 
      axios.get("http://localhost:8080/api/article", { headers : { 'x-access-token': user.accessToken } })

        .then((res) => {
          //If list empty set message state with server response and set list empty
          if (res.data.message) {
            setMessage(res.data.message);
            setArticleList([])
            //We set the article list in the state
          } else {
            setArticleList(res.data);
          };
        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[refresh]);

  function toggleRefresh() {
    setRefresh(!refresh);
  };

  return (
    <div className="articleWrapper">
      {message && (
        <span>{message}</span>
      )}
      <Create func={toggleRefresh}/>
      {articleList && (
        <>
        {articleList.map((article, key) => {

          var data = {
            element: article,
            func: toggleRefresh
          };
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
                    navigate(`/user/${article.author}`)
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
              <ActionBar data={data} />
            </div>
          );
        })}
        </>
      )}
    </div>
  )
}
export default Home;