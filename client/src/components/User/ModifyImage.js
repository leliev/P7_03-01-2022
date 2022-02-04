import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";

function ModifyImage(data) {

  const props = data.data;
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const { userState } = useContext(UserContext);
  const user = userState;
  const [image, setImage] = useState('');
  const [displayForm, setDisplayForm] = useState(false);

  const handleUpload = (event) => {

    event.preventDefault();

    const payload = new FormData();
    payload.append('id', user.id);
    payload.append('image', image);

    axios.put(`http://localhost:8080/api/user/${props.currentProfile.targetId}`, payload, { headers : { 'x-access-token': accessToken } })
      .then((res) => {
        props.func();
        toggleForm();
      }).catch((error) => {
        props.error(error.response.data.message);
      });
  };

  function toggleForm() {
    setDisplayForm(!displayForm);
  };

  return (
    <>
    {user.id === props.currentProfile.targetId && (
      <>
        {displayForm ? (
          <>
            <button onClick={toggleForm}>Close</button>
            <form onSubmit={handleUpload} className="upload">
              <input
                type="file"
                id="image"
                name="image"
                accept=".jpeg, .jpg, .png, .gif, .webp"
                onChange={(event) => setImage(event.target.files[0])}
                aria-label="modifier votre image"
              />
              <button type="submit" aria-label="valider">
                Update
              </button>
            </form>
          </>
        ) : (
          <button onClick={toggleForm}>Update image</button>
        )}
      </>
    )}
    </>
  );
}

export default ModifyImage;