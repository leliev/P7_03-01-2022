import React, {useState} from "react";
import axios from "axios";
import Modify from "./Modify";
import Create from "../Comment/Create";

function ActionBar(props) {

  const user = JSON.parse(sessionStorage.getItem("user"));
  const element = props.props;

  const [displayCForm, setDisplayCForm] = useState(false);
  const [displayMForm, setDisplayMForm] = useState(false);

  const privilege = user.roles.includes("ROLE_ADMIN")
  const owner = user.username === element.author;

  let URL = "";
  let target = "";

  if (element.like) {
    URL = "http://localhost:8080/api/article/";
    target = "article";
  } else {
    URL = "http://localhost:8080/api/comment/";
    target = "comment";
  };

  const onClickDel = () => {

    const payload = { "element": element.id, "user": user.id };
    const data = JSON.stringify(payload);
    axios.delete(URL + data, { headers : { 'x-access-token': user.accessToken } })
      .then(() => {
        if (target === "comment") {
          window.location.reload();
        } else {
          window.location.replace("/");
        };
        
      }).catch((error) => {
        console.log(error);
      });
  };

  function toggleForm(e) {
    console.log(e.target.className)
    if (e.target.className === "modify") {
      setDisplayMForm(!displayMForm);
    } else {
      setDisplayCForm(!displayCForm);
    };
  };

  let data = {
    target: target,
    element: element,
    user: user
  };

  

  return(
    <div>
      {target === "article" ? (
        <>
          {displayCForm ? (
            <div>
              <button className="comment" onClick={(e) => {toggleForm(e)}}>
                Close form
              </button>
              <Create data={data} />
            </div> 
          ) : (
            <>
              <button className="comment" onClick={(e) => {toggleForm(e)}}>
                Comment
              </button>
            </>
          )} 
        </>
      ) : (
        <></>
      )}

      {privilege || owner ? (
        <>
          {displayMForm ? (
            <div>
              <button className="modify" onClick={(e) => {toggleForm(e)}}>
                Close form
              </button>
              <Modify data={data}/>
            </div> 
          ) : (
            <>
              <button className="modify" onClick={(e) => {toggleForm(e)}}>
                modify
              </button>
              <button onClick={onClickDel}>delete</button>
            </>
          )} 
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActionBar;