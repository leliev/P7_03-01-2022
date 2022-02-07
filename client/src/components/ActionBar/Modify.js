import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";

function Modify(data) {

  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const {userState} = useContext(UserContext);
  const user = userState;
  const props = data.data
  const [image, setImage] = useState();
  const [content, setContent] = useState(props.element.content);
  const [displayForm, setDisplayForm] = useState(false);
  const [message, setMessage] = useState(null);
  
  let url = "";
  //Set url base on targeted element
  if (props.target === "article") {
    url = process.env.REACT_APP_BASE_URL + "/article/";
  } else {
    url = process.env.REACT_APP_BASE_URL + "/comment/";
  };

  const handleUpload = (event) => {
    event.preventDefault();
    console.log(content)
    const payload = new FormData();
        //Set data to send as form data
    if (props.target === "article") {
      payload.append('id', user.id);
      payload.append('content', content)
      payload.append('image', image);
    } else if (props.target === "comment") {
      payload.append('id', user.id);
      payload.append('content', content)
    };

    //Send to server
    axios.put(url + props.element.id, payload, { headers : { 'x-access-token': accessToken } })
      .then((res) => {
        //If success close form and activate refresh
        props.func();
        toggleForm();
      }).catch((error) => {
        //Or save error message in state to display
        setMessage(error.response.data.message);
      });
  };
  //Manage form display
  function toggleForm() {
    setDisplayForm(!displayForm);
  };
  
  return (
    <>
      {message && (
        <span className="error_response">{message}</span>
      )}
      {displayForm ? (
        <>
          <button className="popup_form_closebtn" onClick={toggleForm}>
            Close form
          </button>
          <form onSubmit={handleUpload} className="popup_form">
              <button onClick={toggleForm} className="base_form_closebtn">Close</button>
              <br/>
              {image && (
                <div>
                  <img src={image? URL.createObjectURL(image) : null} alt={image? image.name : null} id="profile_preview"/>
                </div>
              )}
              {props.target === "article" && (
                <>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept=".jpeg, .jpg, .png, .gif, .webp"
                    onChange={(event) => setImage(event.target.files[0])}
                    aria-label="modifier votre image"
                  />
                  <label htmlFor="image">Choose an image</label>
                </>
              )}
              <textarea
                aria-label="votre histoire"
                id="content"
                name="content"
                onChange={(event) => setContent(event.target.value)}
                placeholder="My story"
                autoComplete="off"
                defaultValue={props.element.content}
              >
              </textarea>
              <label htmlFor="content">Content : </label>
              <button type="submit" aria-label="valider" className="base_form_button">
                Update
              </button>
            </form>
        </> 
      ) : (
        <>
          <button className="popup_form_button" onClick={toggleForm} >
            Modify
          </button>
        </>
      )}
      
    </>
  )
}

export default Modify;