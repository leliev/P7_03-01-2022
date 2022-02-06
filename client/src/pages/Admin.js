import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../helpers/userContext"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/profile.css"

function Admin() {

  const { userState } = useContext(UserContext);
  const currentUser = userState;
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    //Reset message on render
    setMessage("");
    //Check for user token in session if not redirect to signin
    if (accessToken === null || !accessToken) { 
      window.location.replace("/signin")
    };
    //Check context for displaying page info
    if (currentUser.isLogged && currentUser.isAdmin) {
      axios.get(process.env.REACT_APP_BASE_URL + "/admin", { headers : { 'x-access-token': accessToken } })
        .then((res) => {
          //If logged in Save user list in state to display
          setUserList(res.data);

        }).catch((error) => {
          //Or save error message in state to display
          setMessage(error.response.data.message);
          console.log(error);
        });
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div>
      {message && (
        <span className="error_response">{message}</span>
      )}
      <h1>Admin page</h1>
      <div className="userWrapper">
        {userList.map((user, key) => {
          return (
            <div className="profileThumb">
              <div className="profileCard">
                <img src={user.imageUrl} alt="user profile"/>
                <div className="userCard" key={key} onClick={() => {navigate(`/user/${user.username}`)}}>
                  <div className="userBody">
                    <h2>{user.username}</h2>
                    <span><b>Email</b> : {user.email}</span>
                  </div>
                  <div className="userFooter">
                    <span><b>Articles</b> : {user.articleCount}</span>
                    <span><b>Comments</b> : {user.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default Admin;