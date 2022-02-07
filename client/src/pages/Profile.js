import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../helpers/userContext";
import axios from "axios";
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import ModifyImage from "../components/User/ModifyImage"
import ModifyUser from "../components/User/ModifyUser";
import DeleteUser from "../components/User/DeleteUser";
import "../styles/profile.css"

function Profile() {

  let { name } = useParams();
  const { userState } = useContext(UserContext);
  const user = userState;
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const [message, setMessage] = useState(null);
  const [currentProfile, setCurrentProfile] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [privilege, setPrivilege] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    //Reset message on render
    setMessage("");
    //Check for user token in session if not redirect to signin
    if (accessToken === null || !accessToken) { 
      window.location.replace("/signin")
    };
    //Check if current user is owner of the targeted profile(context)
    if (name === user.username) {
      setIsOwner(true);
    };
    //Check user privileges(context)
    if (user.isAdmin) {
      setPrivilege(true);
    };
    //And again check context for displaying page info
    if (user.isLogged) {
      let URL = process.env.REACT_APP_BASE_URL + `/user/${name}`

      //Retrieve target profile info
      axios.get(URL, { headers : { 'x-access-token': accessToken } })
        .then((res) => {
          //Save it in state
          setCurrentProfile(res.data)
        }).catch((error) => {
          //Or save error message in state to display
          setMessage(error.response.data.message);
          console.log(error);
        });
    } else {
      //Redirect if not logged in context info
      navigate("/signin");
    };  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location, refresh]);//Trigger specified rerender
  
  //To clean up after a change and refresh component info
  function toggleRefresh() {
    setRefresh(!refresh);
  };
  //Props setting
  const data = {
    currentProfile: currentProfile,
    func: toggleRefresh,
    error: setMessage
  };
  
  return (
    <>
      {message && (
        <span className="error_response">{message}</span>
      )}
      <h1>Profile page</h1>
      <div className="profileWrapper">
        <div className="profileCard">
          <img src={currentProfile.imageUrl} alt="user profile"/>
          <div className="userCard">
            <div className="userBody">
              <h2>{currentProfile.username}</h2>
              <span><b>Email</b> : {currentProfile.email}</span>
            </div>
            <div className="userFooter">
              <span><b>Articles</b> : {currentProfile.Article}</span>
              <span><b>Comments</b> : {currentProfile.Comment}</span>
            </div>
          </div>
        </div>
        <div className="profileFooter">
          {(privilege || isOwner) && (
            <>
              <DeleteUser data={data}/>
            </>
          )}
          {isOwner && (
            <>
              <ModifyImage data={data}/>
              <ModifyUser data={data}/>
            </>   
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;