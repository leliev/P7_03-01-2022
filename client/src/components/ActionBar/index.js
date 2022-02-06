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

  const privilege = user.isAdmin
  const owner = user.username === element.author;

  let URL = "";
  let target = "";

  if (element.like) {
    URL = process.env.REACT_APP_BASE_URL + "/article/";
    target = "article";
  } else {
    URL = process.env.REACT_APP_BASE_URL + "/comment/";
    target = "comment";
  };

  const onClickDel = () => {

    const payload = { "element": element.id, "user": user.id };
    const data = JSON.stringify(payload);
    axios.delete(URL + data, { headers : { 'x-access-token': accessToken } })
      .then(() => {
        props.data.func();
      }).catch((error) => {
        console.log(error.response.data.message);
      });
  };

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
            <button onClick={onClickDel}className="popup_form_closebtn">delete</button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActionBar;