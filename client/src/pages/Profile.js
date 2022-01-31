import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation} from 'react-router-dom';

function Profile() {

  let { name } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [message, setMessage] = useState(null);
  const [currentProfile, setCurrentProfile] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    setMessage("");

    if (user) {
      let URL = `http://localhost:8080/api/user/${name}`

      console.log(URL)
      axios.get(URL, { headers : { 'x-access-token': user.accessToken } })
        .then((res) => {
          console.log(res.data)
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
    
  return (
    <div>
      {message && (
        <span>{message}</span>
      )}
      <h1>Profile page</h1>
      <div className="userCard">
        <div className="userBody">
          <h3>{currentProfile.username}</h3>
          <span>Email : {currentProfile.email}</span>
        </div>
        <div className="userFooter">
          <span>Articles : {currentProfile.Article}</span>
          <span>Comments : {currentProfile.Comment}</span>
        </div>
      </div>      
    </div>
  );
}

export default Profile;