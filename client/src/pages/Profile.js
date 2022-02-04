import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../helpers/userContext";
import axios from "axios";
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import ModifyImage from "../components/User/ModifyImage"
import ModifyUser from "../components/User/ModifyUser";
import DeleteUser from "../components/User/DeleteUser";

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

    setMessage("");

    if (accessToken === null || !accessToken) { 
      window.location.replace("/signin")
    };
    
    if (name === user.username) {
      setIsOwner(true);
    };
    if (user.isAdmin) {
      setPrivilege(true);
    };

    if (user.isLogged) {
      let URL = `http://localhost:8080/api/user/${name}`

      console.log(isOwner, privilege)
      axios.get(URL, { headers : { 'x-access-token': accessToken } })
        .then((res) => {
          setCurrentProfile(res.data)
        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    } else {
      navigate("/signin");
    };  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location, refresh]);

  function toggleRefresh() {
    setRefresh(!refresh);
  };
  
  const data = {
    currentProfile: currentProfile,
    func: toggleRefresh,
    error: setMessage
  };

  console.log("has privilege"+privilege, "isOwner:"+isOwner)
  return (
    <>
      {message && (
        <span>{message}</span>
      )}
      <h1>Profile page</h1>
      <div className="profileCard">
        <div className="imageCard">
          <img src={currentProfile.imageUrl} alt="user profile"/>
        </div>
        <div className="userCard">
          <div className="userBody">
            <h2>{currentProfile.username}</h2>
            <span>Email : {currentProfile.email}</span>
          </div>
          <div className="userFooter">
            <span>Articles : {currentProfile.Article}</span>
            <span>Comments : {currentProfile.Comment}</span>
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
    </>
  );
};

export default Profile;