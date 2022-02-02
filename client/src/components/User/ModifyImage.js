import React, { useState } from "react";
import axios from "axios";

function ModifyImage(data) {

  const props = data.data;
  const [image, setImage] = useState('');

  const handleUpload = (event) => {

    event.preventDefault();

    const payload = new FormData();
    payload.append('id', props.user.id);
    payload.append('image', image);

    axios.put(`http://localhost:8080/api/user/${props.currentProfile.targetId}`, payload, { headers : { 'x-access-token': props.user.accessToken } })
      .then((res) => {
        //setImage({ ...image, image: data });
        window.location.replace(`/user/${props.currentProfile.username}`);
      }).catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <>
    {props.user.id === props.currentProfile.targetId ? (
      <form onSubmit={handleUpload} className="upload">
        <br />
        <input
          type="file"
          id="image"
          name="image"
          accept=".jpeg, .jpg, .png, .gif, .webp"
          onChange={(event) => setImage(event.target.files[0])}
          aria-label="modifier votre image"
        />
        <br />
        <button type="submit" aria-label="valider">
          Update
        </button>
      </form>
    ) : (
      <></>
    )}
    </>
  );
}

export default ModifyImage;