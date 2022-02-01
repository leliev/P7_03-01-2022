import React, { useState } from "react";

import axios from "axios";

function ModifyImage() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [image, setImage] = useState('');

  const handleUpload = (event) => {

    event.preventDefault();

    const data = new FormData();
    data.append('id', user.id);
    data.append('image', image);

    axios.put(`http://localhost:8080/api/user/${user.id}`, data, { headers : { 'x-access-token': user.accessToken } })
      .then((res) => {
        //setImage({ ...image, image: data });
        window.location.replace(`/user/${user.username}`);
      }).catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <>
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
    </>
  );
}

export default ModifyImage;