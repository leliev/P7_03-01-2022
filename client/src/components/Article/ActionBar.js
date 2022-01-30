import React, {useState} from "react";
import axios from "axios";
import Modify from "./Modify";

function ActionBar(props) {

  const user = JSON.parse(sessionStorage.getItem("user"));

  const article = props.props;
  const [displayForm, setDisplayForm] = useState(false);

  const privilege = user.roles.includes("ROLE_ADMIN")
  const owner = user.username === article.author;

  const onClickDel = () => {

    const payload = { "element": article.id, "user": user.id };
    const data = JSON.stringify(payload);

    axios.delete(`http://localhost:8080/api/article/${data}`, { headers : { 'x-access-token': user.accessToken } })
      .then(() => {
        window.location.replace("/");
      }).catch((error) => {
        console.log(error);
      });
  };

  function toggleForm() {
    setDisplayForm(!displayForm);
  };

  let data = {
    article: article,
    user: user
  };

  

  return(
    <div>
      {privilege || owner ? (
        <>
          {displayForm ? (
            <div>
              <button onClick={toggleForm}>
                Close form
              </button>
              <Modify data={data}/>
            </div> 
          ) : (
            <>
              <button onClick={toggleForm}>
                modify
              </button>
              <button onClick={onClickDel}>delete</button>
            </>
          )} 
        </>
      ) : (
        <><p>oups</p></>
      )}
    </div>
  );
};

export default ActionBar;