import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { articleSchema } from "../../helpers/Schema/articleSchema";

function Create(props) {
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const { userState } = useContext(UserContext);
  const user = userState;
  const [displayForm, setDisplayForm] = useState(false);
  const [message, setMessage] = useState("an error occured plese wait");
  
  useEffect(() => {
    setMessage("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const validationSchema = articleSchema;
  const initialValues = {
    title: "",
    content: ""
  };

  const onSubmit = (data) => {
    
    const payload = {
      ...data,
      id: user.id
    };

    axios.post("http://localhost:8080/api/article", payload, { headers : { 'x-access-token': accessToken } })
      .then((response) => {
        console.log(response.data.message);
        toggleForm()
        props.func(true);
      }).catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  
  function toggleForm() {
    setDisplayForm(!displayForm);
  };
  return (
    <div>
      {message && (
        <span className="error_response">{message}</span>
      )}
      {displayForm ? (
        <div className="articleCreator">
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form id="article_create" className="base_form">
              <button onClick={toggleForm} className="base_form_closebtn">
                Close form
              </button>
              <h3>Share your story</h3>
              <label htmlFor="title">Title : </label>
              <br/>
              <Field
                aria-label="titre de l'article"
                id="title"
                name="title"
                placeholder="My Title"
                autoComplete="off"
              />
              <br />
              <ErrorMessage name="title" component="span" className="form_error"/>
              <br />
              <label htmlFor="content">Content : </label>
              <br />
              <Field
                as="textarea"
                aria-label="votre histoire"
                id="content"
                name="content"
                placeholder="My story"
                autoComplete="off"
              />
              <br />
              <ErrorMessage name="content" component="span" className="form_error"/>
              <br />
              <button
                className="base_form_button"
                type="submit"
                aria-label="valider"
              >
                Submit
              </button>
            </Form>
          </Formik>
        </div> 
      ) : (
        <div className="articleCreator">
          <button onClick={toggleForm} className="base_form_button">
            Share your Story
          </button>
        </div>
      )}
      
    </div>
  )
}

export default Create;