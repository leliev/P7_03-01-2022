import React, {useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import Modify from "./Modify";
import Create from "../Comment/Create";

function ActionBar(props) {

  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const {userState} = useContext(UserContext);
  const user = userState;
  const element = props.data.element;
  //Check context user data for admin privilege
  const privilege = user.isAdmin
  //Check context data for ownership of the related element
  const owner = user.username === element.author;

  let URL = "";
  let target = "";
  //If the element has like value it's an article
  if (element.like) {
    //If the element has like value it's an article
    URL = process.env.REACT_APP_BASE_URL + "/article/";
    target = "article";
  } else {
    //Else it's a comment
    URL = process.env.REACT_APP_BASE_URL + "/comment/";
    target = "comment";
  };
  //Delete the related element
  const onClickDel = () => {
    //Set data params to send
    const payload = { "element": element.id, "user": user.id };
    const data = JSON.stringify(payload);
    axios.delete(URL + data, { headers : { 'x-access-token': accessToken } })
      .then(() => {
        //Initiate parent refresh
        props.data.func();
      }).catch((error) => {
        //Or log the error
        console.log(error.response.data.message);
      });
  };
  //Set children props
  let data = {
    target: target,
    element: element,
    func: props.data.func
  };

  return(
    <div className="actionbar">
      {target === "article" ? (
        <>
          <Create data={data} />
        </>
      ) : (
        <></>
      )}
      {privilege || owner ? (
        <>
          <Modify data={data}/>
          <div>
            <button onClick={onClickDel}className="popup_form_closebtn">Delete</button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActionBar;