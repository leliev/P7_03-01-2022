import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import ModifyImage from "../components/User/ModifyImage"
import ModifyUser from "../components/User/ModifyUser";

function Profile() {

  let { name } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [message, setMessage] = useState(null);
  const [currentProfile, setCurrentProfile] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [privilege, setPrivilege] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    setMessage("");
    if (name === user.username) {
      setIsOwner(true);
      console.log(isOwner+ ","+name +","+user.username)
    };
    if (user.roles.includes("ROLE_ADMIN")) {
      setPrivilege(true);
    };

    if (user) {
      let URL = `http://localhost:8080/api/user/${name}`

      console.log(isOwner, privilege)
      axios.get(URL, { headers : { 'x-access-token': user.accessToken } })
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
  },[location]);

  

  let data = {
    currentProfile: currentProfile,
    user: user
  };
  console.log("has privilege"+privilege, "isOwner:"+isOwner)
  return (
    <>
      <h1>Profile page</h1>
      <div className="profileCard">
        {message && (
          <span>{message}</span>
        )}
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
                <button>Delete User</button>
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
}

export default Profile;