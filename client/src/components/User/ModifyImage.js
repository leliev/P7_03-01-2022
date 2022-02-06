import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";

function ModifyImage(data) {

  const props = data.data;
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const { userState } = useContext(UserContext);
  const user = userState;
  const [image, setImage] = useState();
  const [displayForm, setDisplayForm] = useState(false);

  const handleUpload = (event) => {

    event.preventDefault();

    const payload = new FormData();
    payload.append('id', user.id);
    payload.append('image', image);

    axios.put(process.env.REACT_APP_BASE_URL + `/user/${props.currentProfile.targetId}`, payload, { headers : { 'x-access-token': accessToken } })
      .then((res) => {
        props.func();
        toggleForm();
      }).catch((error) => {
        props.error(error.response.data.message);
      });
  };

  function toggleForm() {
    setDisplayForm(!displayForm);
    setImage();
  };

  return (
    <>
    {user.id === props.currentProfile.targetId && (
      <>
        {displayForm ? (
          <>
            <button onClick={toggleForm} className="base_form_closebtn">Close</button>
            <form onSubmit={handleUpload} className="popup_form">
              <button onClick={toggleForm} className="base_form_closebtn">Close</button>
              {image && (
                <div>
                  <img src={image? URL.createObjectURL(image) : null} alt={image? image.name : null} id="profile_preview"/>
                </div>
              )}
              
              <input
                type="file"
                id="image"
                name="image"
                accept=".jpeg, .jpg, .png, .gif, .webp"
                onChange={(event) => setImage(event.target.files[0])}
                aria-label="modifier votre image"
              />
              <label htmlFor="image">Choose a file</label>
              <button type="submit" aria-label="valider" className="base_form_button">
                Update
              </button>
            </form>
          </>
        ) : (
          <button onClick={toggleForm} className="base_form_button">Update image</button>
        )}
      </>
    )}
    </>
  );
}

export default ModifyImage;