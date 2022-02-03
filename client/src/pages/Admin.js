import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../helpers/userContext"
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Admin() {
  const { userState } = useContext(UserContext);
  const currentUser = userState;

  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    setMessage("");

    if (!currentUser.isLogged) {
      navigate("/signin");
    };

    if (currentUser.isLogged) {
      axios.get("http://localhost:8080/api/admin", { headers : { 'x-access-token': currentUser.accessToken } })

        .then((res) => {
          setUserList(res.data);

        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div>
      {message && (
        <span>{message}</span>
      )}
      <h1>Admin page</h1>
      <div className="userWrapper">
        {userList.map((user, key) => {
          return (
            <div className="userCard" key={key} onClick={() => {navigate(`/user/${user.username}`)}}>
              <div className="userBody">
                <h3>{user.username}</h3>
                <span>Email : {user.email}</span>
              </div>
              <div className="userFooter">
                <span>Articles : {user.articleCount}</span>
                <span>Comments : {user.commentCount}</span>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default Admin;